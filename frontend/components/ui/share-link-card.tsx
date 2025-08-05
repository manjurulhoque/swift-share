import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { File as FileIcon, Copy, Edit, Trash2 } from "lucide-react";
import { ShareLink } from "@/types/share";

interface ShareLinkCardProps {
    share: ShareLink;
    onCopyLink: (token: string) => void;
    onEdit: (share: ShareLink) => void;
    onDelete: (share: ShareLink) => void;
}

export function ShareLinkCard({
    share,
    onCopyLink,
    onEdit,
    onDelete,
}: ShareLinkCardProps) {
    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatExpiryDate = (dateString: string | null): string => {
        if (!dateString) return "Never";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <FileIcon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0 max-w-[200px]">
                            <h3
                                className="font-medium text-gray-900 truncate"
                                title={
                                    share.file?.original_name || "Unknown file"
                                }
                            >
                                {share.file?.original_name || "Unknown file"}
                            </h3>
                            <p className="text-sm text-gray-500">
                                {share.file?.file_size
                                    ? `${(
                                          share.file.file_size /
                                          1024 /
                                          1024
                                      ).toFixed(2)} MB`
                                    : "Unknown size"}
                            </p>
                        </div>
                    </div>
                    <Badge
                        variant={share.is_active ? "default" : "secondary"}
                        className="text-xs"
                    >
                        {share.is_active ? "Active" : "Inactive"}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="space-y-3">
                    <p className="text-sm text-gray-600 line-clamp-2">
                        {share.description || "No description"}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-4">
                            <span>{formatDate(share.created_at)}</span>
                            <span>{share.download_count} downloads</span>
                        </div>
                    </div>
                    <div className="space-y-2 text-xs text-gray-500">
                        <div className="flex justify-between">
                            <span>Expires:</span>
                            <span>{formatExpiryDate(share.expires_at)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Max Downloads:</span>
                            <span>
                                {share.max_downloads === 0
                                    ? "Unlimited"
                                    : share.max_downloads}
                            </span>
                        </div>
                        {share.has_password && (
                            <div className="flex justify-between">
                                <span>Password:</span>
                                <span>Protected</span>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center space-x-2">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onCopyLink(share.token)}
                            >
                                <Copy className="h-4 w-4 mr-1" />
                                Copy Link
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onEdit(share)}
                            >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                            </Button>
                        </div>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onDelete(share)}
                        >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
