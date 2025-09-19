import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface EmptyStateProps {
  onBack: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onBack }) => (
  <div className="container mx-auto p-6 max-w-5xl">
    <Alert className="mb-6">
      <AlertTitle>Product not found</AlertTitle>
      <AlertDescription>
        The product you're trying to order doesn't exist.
      </AlertDescription>
    </Alert>
    <Button onClick={onBack}>
      <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
    </Button>
  </div>
);

export default EmptyState;
