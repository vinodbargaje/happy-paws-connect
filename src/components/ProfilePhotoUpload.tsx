import { useState } from "react";
import { Button } from "@/components/ui/button";
import { User, Upload, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ProfilePhotoUploadProps {
    currentUrl?: string | null;
    onUpload: (url: string) => void;
    bucketName?: string;
}

const ProfilePhotoUpload = ({
    currentUrl,
    onUpload,
    bucketName = "avatars"
}: ProfilePhotoUploadProps) => {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(currentUrl || null);

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from(bucketName)
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);

            if (data) {
                setPreview(data.publicUrl);
                onUpload(data.publicUrl);
                toast.success("Profile photo uploaded!");
            }

        } catch (error: any) {
            toast.error(error.message || "Error uploading image");
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = () => {
        setPreview(null);
        onUpload("");
    };

    return (
        <div>
            <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 rounded-xl bg-muted flex items-center justify-center overflow-hidden border border-border">
                    {preview ? (
                        <img
                            src={preview}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <User className="w-8 h-8 text-muted-foreground" />
                    )}
                    {uploading && (
                        <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                            <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            className="gap-2 relative overflow-hidden"
                            disabled={uploading}
                        >
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleUpload}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                            <Upload className="w-4 h-4" />
                            {uploading ? "Uploading..." : "Upload Photo"}
                        </Button>

                        {preview && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={handleRemove}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Recommended: Square JPG, PNG up to 2MB
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProfilePhotoUpload;
