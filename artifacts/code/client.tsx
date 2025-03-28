import React, { useEffect, useRef, Dispatch, SetStateAction } from 'react'; // Import Dispatch, SetStateAction
import { Artifact } from '@/components/create-artifact'; // Remove ArtifactContent import
// import { CodeEditor } from '@/components/code-editor'; // Commented out CodeEditor import
import {
  CopyIcon,
  LogsIcon,
  MessageIcon,
  PlayIcon,
  RedoIcon,
  UndoIcon,
  CodeIcon, // Added CodeIcon
} from '@/components/icons';
import { toast } from 'sonner';
import { generateUUID } from '@/lib/utils';
import { Button } from '@/components/ui/button'; // Added Button import
import {
  Console,
  ConsoleOutput,
  ConsoleOutputContent,
} from '@/components/console';

// --- Helper Function to Execute Code ---
const executeCode = async (
  content: string,
  setMetadata: (
    updater: (currentMetadata: Metadata) => Metadata,
  ) => void,
) => {
  const runId = generateUUID();
  const outputContent: Array<ConsoleOutputContent> = [];

  setMetadata((metadata) => ({
    ...metadata,
    outputs: [
      ...(metadata?.outputs ?? []), // Ensure outputs is initialized
      {
        id: runId,
        contents: [],
        status: 'in_progress',
      },
    ],
  }));

  try {
    // @ts-expect-error - loadPyodide is globally available after script load
    const currentPyodideInstance = await globalThis.loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/',
    });

    currentPyodideInstance.setStdout({
      batched: (output: string) => {
        outputContent.push({
          type: output.startsWith('data:image/png;base64') ? 'image' : 'text',
          value: output,
        });
      },
    });

    await currentPyodideInstance.loadPackagesFromImports(content, {
      messageCallback: (message: string) => {
        setMetadata((metadata) => ({
          ...metadata,
          outputs: [
            ...(metadata?.outputs ?? []).filter((output) => output.id !== runId),
            {
              id: runId,
              contents: [{ type: 'text', value: message }],
              status: 'loading_packages',
            },
          ],
        }));
      },
    });

    const requiredHandlers = detectRequiredHandlers(content);
    for (const handler of requiredHandlers) {
      if (OUTPUT_HANDLERS[handler as keyof typeof OUTPUT_HANDLERS]) {
        await currentPyodideInstance.runPythonAsync(
          OUTPUT_HANDLERS[handler as keyof typeof OUTPUT_HANDLERS],
        );

        if (handler === 'matplotlib') {
          await currentPyodideInstance.runPythonAsync(
            'setup_matplotlib_output()',
          );
        }
      }
    }

    await currentPyodideInstance.runPythonAsync(content);

    setMetadata((metadata) => ({
      ...metadata,
      outputs: [
        ...(metadata?.outputs ?? []).filter((output) => output.id !== runId),
        {
          id: runId,
          contents: outputContent,
          status: 'completed',
        },
      ],
    }));
  } catch (error: any) {
    setMetadata((metadata) => ({
      ...metadata,
      outputs: [
        ...(metadata?.outputs ?? []).filter((output) => output.id !== runId),
        {
          id: runId,
          contents: [{ type: 'text', value: error.message }],
          status: 'failed',
        },
      ],
    }));
  }
};
// --- End Helper Function ---


const OUTPUT_HANDLERS = {
  matplotlib: `
    import io
    import base64
    from matplotlib import pyplot as plt

    # Clear any existing plots
    plt.clf()
    plt.close('all')

    # Switch to agg backend
    plt.switch_backend('agg')

    def setup_matplotlib_output():
        def custom_show():
            if plt.gcf().get_size_inches().prod() * plt.gcf().dpi ** 2 > 25_000_000:
                print("Warning: Plot size too large, reducing quality")
                plt.gcf().set_dpi(100)

            png_buf = io.BytesIO()
            plt.savefig(png_buf, format='png')
            png_buf.seek(0)
            png_base64 = base64.b64encode(png_buf.read()).decode('utf-8')
            print(f'data:image/png;base64,{png_base64}')
            png_buf.close()

            plt.clf()
            plt.close('all')

        plt.show = custom_show
  `,
  basic: `
    # Basic output capture setup
  `,
};

function detectRequiredHandlers(code: string): string[] {
  const handlers: string[] = ['basic'];

  if (code.includes('matplotlib') || code.includes('plt.')) {
    handlers.push('matplotlib');
  }

  return handlers;
}

interface Metadata {
  outputs: Array<ConsoleOutput>;
}

// Remove the custom ActionContext type

// Define the React component for rendering the content
// Define props inline since ArtifactContent is not exported
const CodeArtifactDisplay: React.FC<{
  metadata: Metadata;
  setMetadata: Dispatch<SetStateAction<Metadata>>; // Use correct React state setter type
  content: string;
  status: 'streaming' | 'idle';
  documentId?: string; // Optional if not always present
  version?: number; // Optional if not always present
}> = ({
  metadata,
  setMetadata,
  content,
  status,
  documentId,
  version,
  ...props // Capture other potential props
}) => {
  const [showCode, setShowCode] = React.useState(false);
  const hasRun = useRef(false);

  useEffect(() => {
    if (content && status !== 'streaming' && !hasRun.current) {
      console.log(`Artifact ${documentId} v${version} completed, executing code...`);
      executeCode(content, setMetadata);
      hasRun.current = true;
    }
    if (status === 'streaming') {
      hasRun.current = false;
    }
  }, [content, status, setMetadata, documentId, version]);

  return (
    <>
      {/* Always render Console */}
      <Console
        consoleOutputs={metadata?.outputs ?? []}
        setConsoleOutputs={(updater) => {
          setMetadata((currentMeta: Metadata) => ({ // Added Metadata type here
            ...currentMeta,
            outputs: typeof updater === 'function' ? updater(currentMeta.outputs ?? []) : [], // Ensure currentMeta.outputs is array
          }));
        }}
      />
      {/* Hiding the code editor and toggle button */}
    </>
  );
};


export const codeArtifact = new Artifact<'code', Metadata>({
  kind: 'code',
  description:
    'Useful for code generation. Python code runs automatically and shows output.', // Updated description
  initialize: async ({ setMetadata }) => {
    setMetadata({
      outputs: [], // Initialize outputs
    });
  },
  // Removed artifact from params as it's not directly provided here
  onStreamPart: ({ streamPart, setArtifact }) => {
    if (streamPart.type === 'code-delta') {
      setArtifact((draftArtifact) => ({
        ...draftArtifact,
        content: streamPart.content as string,
        // Auto-show artifact when streaming starts, keep it visible
        isVisible: true,
        // Status remains 'streaming' while receiving deltas
        status: 'streaming',
      }));
    }
    // Removed the 'artifact-end' check as it's not a standard delta type
    // The parent component managing artifacts should set the status to 'idle' or similar when the stream ends.
  },
  // The useEffect in the content component will handle the transition based on the status prop change.

  // Use the defined component for content rendering
  content: CodeArtifactDisplay,

  // Remove explicit ActionContext types, rely on inferred types
  actions: [
    // Removed the manual 'Run' action
    {
      icon: <UndoIcon size={18} />,
      description: 'View Previous version',
      onClick: ({ handleVersionChange }) => { // Type is inferred
        handleVersionChange('prev');
      },
      isDisabled: ({ currentVersionIndex }) => currentVersionIndex === 0, // Type is inferred
    },
    {
      icon: <RedoIcon size={18} />,
      description: 'View Next version',
      onClick: ({ handleVersionChange }) => { // Type is inferred
        handleVersionChange('next');
      },
      isDisabled: ({ isCurrentVersion }) => isCurrentVersion, // Type is inferred
    },
    {
      icon: <CopyIcon size={18} />,
      description: 'Copy code to clipboard',
      onClick: ({ content }) => { // Type is inferred
        if (content) {
          navigator.clipboard.writeText(content);
          toast.success('Copied to clipboard!');
        } else {
          toast.error('No code content to copy.');
        }
      },
    },
    // Optional: Re-run button
  ],
  toolbar: [
    {
      icon: <MessageIcon />,
      description: 'Add comments',
      onClick: ({ appendMessage }) => { // Type is inferred
        appendMessage({
          role: 'user',
          content: 'Add comments to the code snippet for understanding', // Consider localizing this later
        });
      },
    },
    {
      icon: <LogsIcon />,
      description: 'Add logs',
      onClick: ({ appendMessage }) => { // Type is inferred
        appendMessage({
          role: 'user',
          content: 'Add logs to the code snippet for debugging', // Consider localizing this later
        });
      },
    },
  ],
});
