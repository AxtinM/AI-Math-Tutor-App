'use client';

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { CrossIcon } from "./icons";

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (file: File) => void;
}

export const CameraModal = ({ isOpen, onClose, onCapture }: CameraModalProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraSupported, setIsCameraSupported] = useState(true);

  // Check if camera is supported in this browser
  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setIsCameraSupported(false);
      if (isOpen) {
        toast.error("Your browser doesn't support camera access");
        onClose();
      }
    }
  }, [isOpen, onClose]);

  // Start camera when modal opens
  useEffect(() => {
    let mounted = true;
    
    if (isOpen && isCameraSupported) {
      const startCamera = async () => {
        try {
          console.log("Attempting to access camera...");
          const constraints = {
            video: {
              facingMode: 'environment', // Prefer rear camera on mobile
              width: { ideal: 1280 },
              height: { ideal: 720 }
            }
          };
          
          const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
          console.log("Camera access granted, tracks:", mediaStream.getVideoTracks().length);
          
          // Only set if component is still mounted
          if (!mounted) return;
          
          setStream(mediaStream);
          
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
            
            // Ensure video plays once metadata is loaded
            videoRef.current.onloadedmetadata = () => {
              if (videoRef.current) {
                videoRef.current.play().catch(e => {
                  console.error("Error playing video:", e);
                });
              }
            };
          }
        } catch (err) {
          console.error("Error accessing camera:", err);
          toast.error("Could not access camera. Please check permissions.");
          onClose();
        }
      };

      startCamera();
    }
    
    // Cleanup function to stop the camera when modal closes
    return () => {
      mounted = false;
      if (stream) {
        console.log("Stopping camera tracks");
        stream.getTracks().forEach(track => {
          track.stop();
          console.log(`Track ${track.id} stopped`);
        });
        setStream(null);
        
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
      }
    };
  }, [isOpen, isCameraSupported, onClose]);

  const captureImage = useCallback((e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas dimensions to match the video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw the current video frame on the canvas
    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to blob
      canvas.toBlob((blob) => {
        if (blob) {
          // Create a file from the blob
          const fileName = `captured-image-${Date.now()}.jpg`;
          const file = new File([blob], fileName, { type: 'image/jpeg' });
          
          // Pass the file to the parent component and wait for completion
          // before closing to prevent form submissions
          Promise.resolve(onCapture(file))
            .then(() => {
              // Close modal after upload is complete
              onClose();
            })
            .catch(err => {
              console.error("Error during capture process:", err);
              onClose();
            });
        }
      }, 'image/jpeg', 0.95); // High quality JPEG
    }
  }, [onClose, onCapture]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex flex-col items-center justify-center">
      <div className="relative w-full max-w-md mx-auto">
        <Button 
          className="absolute right-4 top-4 rounded-full p-2 bg-black bg-opacity-40 text-white z-10"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose();
          }}
          variant="ghost"
          type="button"
        >
          <CrossIcon />
        </Button>
        
        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        </div>
        
        <canvas ref={canvasRef} className="hidden" /> {/* Hidden canvas for capturing */}
        
        <div className="flex justify-center mt-6 pb-8">
          <Button
            onClick={captureImage}
            className="rounded-full w-16 h-16 bg-white border-4 border-primary"
            type="button"
          >
            <span className="sr-only">Take Photo</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
