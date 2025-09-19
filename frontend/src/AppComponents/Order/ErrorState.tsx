import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  error: unknown;
  onBack: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, onBack }) => {
  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {(error as Error)?.message || "Failed to load product"}
        </AlertDescription>
      </Alert>
      <Button onClick={onBack}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
      </Button>
    </div>
  );
};

export default ErrorState;
