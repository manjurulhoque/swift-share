"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
    Search,
    X,
    Calendar as CalendarIcon,
    FileType,
    User,
    Tag,
    Clock,
    Filter,
} from "lucide-react";
import { format } from "date-fns";

export interface SearchFilters {
    query: string;
    fileTypes: string[];
    tags: string[];
    dateFrom?: Date;
    dateTo?: Date;
    owner?: string;
    sizeMin?: number;
    sizeMax?: number;
    isStarred?: boolean;
    isPublic?: boolean;
}

interface AdvancedSearchProps {
    filters: SearchFilters;
    onFiltersChange: (filters: SearchFilters) => void;
    onClear: () => void;
    isLoading?: boolean;
}

const FILE_TYPES = [
    {
        value: "image",
        label: "Images",
        extensions: ["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp"],
    },
    {
        value: "document",
        label: "Documents",
        extensions: ["pdf", "doc", "docx", "txt", "rtf", "odt"],
    },
    {
        value: "spreadsheet",
        label: "Spreadsheets",
        extensions: ["xls", "xlsx", "csv", "ods"],
    },
    {
        value: "presentation",
        label: "Presentations",
        extensions: ["ppt", "pptx", "odp"],
    },
    {
        value: "video",
        label: "Videos",
        extensions: ["mp4", "avi", "mov", "wmv", "flv", "webm", "mkv"],
    },
    {
        value: "audio",
        label: "Audio",
        extensions: ["mp3", "wav", "flac", "aac", "ogg", "wma"],
    },
    {
        value: "archive",
        label: "Archives",
        extensions: ["zip", "rar", "7z", "tar", "gz", "bz2"],
    },
    {
        value: "code",
        label: "Code",
        extensions: ["js", "ts", "py", "java", "cpp", "html", "css", "sql"],
    },
];

const SIZE_RANGES = [
    { value: "small", label: "Small (< 1MB)", min: 0, max: 1024 * 1024 },
    {
        value: "medium",
        label: "Medium (1MB - 10MB)",
        min: 1024 * 1024,
        max: 10 * 1024 * 1024,
    },
    {
        value: "large",
        label: "Large (10MB - 100MB)",
        min: 10 * 1024 * 1024,
        max: 100 * 1024 * 1024,
    },
    {
        value: "xlarge",
        label: "Very Large (> 100MB)",
        min: 100 * 1024 * 1024,
        max: undefined,
    },
];

export function AdvancedSearch({
    filters,
    onFiltersChange,
    onClear,
    isLoading = false,
}: AdvancedSearchProps) {
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [dateFromOpen, setDateFromOpen] = useState(false);
    const [dateToOpen, setDateToOpen] = useState(false);
    const [tagInput, setTagInput] = useState("");

    const updateFilters = (updates: Partial<SearchFilters>) => {
        onFiltersChange({ ...filters, ...updates });
    };

    const addTag = (tag: string) => {
        if (tag.trim() && !filters.tags.includes(tag.trim())) {
            updateFilters({ tags: [...filters.tags, tag.trim()] });
            setTagInput("");
        }
    };

    const removeTag = (tagToRemove: string) => {
        updateFilters({
            tags: filters.tags.filter((tag) => tag !== tagToRemove),
        });
    };

    const toggleFileType = (fileType: string) => {
        const newTypes = filters.fileTypes.includes(fileType)
            ? filters.fileTypes.filter((type) => type !== fileType)
            : [...filters.fileTypes, fileType];
        updateFilters({ fileTypes: newTypes });
    };

    const setSizeRange = (range: string) => {
        const sizeRange = SIZE_RANGES.find((r) => r.value === range);
        if (sizeRange) {
            updateFilters({
                sizeMin: sizeRange.min,
                sizeMax: sizeRange.max,
            });
        }
    };

    const hasActiveFilters =
        filters.fileTypes.length > 0 ||
        filters.tags.length > 0 ||
        filters.dateFrom ||
        filters.dateTo ||
        filters.owner ||
        filters.sizeMin !== undefined ||
        filters.sizeMax !== undefined ||
        filters.isStarred ||
        filters.isPublic;

    return (
        <div className="space-y-4">
            {/* Main Search Bar */}
            <div className="flex gap-2">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search files and folders..."
                        className="pl-10"
                        value={filters.query}
                        onChange={(e) =>
                            updateFilters({ query: e.target.value })
                        }
                    />
                </div>
                <Button
                    variant={showAdvanced ? "default" : "outline"}
                    onClick={() => setShowAdvanced(!showAdvanced)}
                >
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                    {hasActiveFilters && (
                        <Badge variant="secondary" className="ml-2">
                            {[
                                filters.fileTypes.length,
                                filters.tags.length,
                                filters.dateFrom ? 1 : 0,
                                filters.dateTo ? 1 : 0,
                                filters.owner ? 1 : 0,
                                filters.sizeMin !== undefined ||
                                filters.sizeMax !== undefined
                                    ? 1
                                    : 0,
                                filters.isStarred ? 1 : 0,
                                filters.isPublic ? 1 : 0,
                            ].reduce((sum, count) => sum + count, 0)}
                        </Badge>
                    )}
                </Button>
                {hasActiveFilters && (
                    <Button variant="ghost" onClick={onClear}>
                        <X className="h-4 w-4 mr-2" />
                        Clear
                    </Button>
                )}
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
                <div className="flex flex-wrap gap-2">
                    {filters.fileTypes.map((type) => (
                        <Badge key={type} variant="secondary" className="gap-1">
                            <FileType className="h-3 w-3" />
                            {FILE_TYPES.find((ft) => ft.value === type)
                                ?.label || type}
                            <button
                                onClick={() => toggleFileType(type)}
                                className="ml-1 hover:text-red-500"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    ))}
                    {filters.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="gap-1">
                            <Tag className="h-3 w-3" />
                            {tag}
                            <button
                                onClick={() => removeTag(tag)}
                                className="ml-1 hover:text-red-500"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    ))}
                    {filters.dateFrom && (
                        <Badge variant="secondary" className="gap-1">
                            <CalendarIcon className="h-3 w-3" />
                            From: {format(filters.dateFrom, "MMM dd, yyyy")}
                            <button
                                onClick={() =>
                                    updateFilters({ dateFrom: undefined })
                                }
                                className="ml-1 hover:text-red-500"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    )}
                    {filters.dateTo && (
                        <Badge variant="secondary" className="gap-1">
                            <CalendarIcon className="h-3 w-3" />
                            To: {format(filters.dateTo, "MMM dd, yyyy")}
                            <button
                                onClick={() =>
                                    updateFilters({ dateTo: undefined })
                                }
                                className="ml-1 hover:text-red-500"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    )}
                    {filters.owner && (
                        <Badge variant="secondary" className="gap-1">
                            <User className="h-3 w-3" />
                            Owner: {filters.owner}
                            <button
                                onClick={() =>
                                    updateFilters({ owner: undefined })
                                }
                                className="ml-1 hover:text-red-500"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    )}
                    {(filters.sizeMin !== undefined ||
                        filters.sizeMax !== undefined) && (
                        <Badge variant="secondary" className="gap-1">
                            <Clock className="h-3 w-3" />
                            Size:{" "}
                            {SIZE_RANGES.find(
                                (r) =>
                                    r.min === filters.sizeMin &&
                                    r.max === filters.sizeMax
                            )?.label || "Custom"}
                            <button
                                onClick={() =>
                                    updateFilters({
                                        sizeMin: undefined,
                                        sizeMax: undefined,
                                    })
                                }
                                className="ml-1 hover:text-red-500"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    )}
                    {filters.isStarred && (
                        <Badge variant="secondary" className="gap-1">
                            Starred
                            <button
                                onClick={() =>
                                    updateFilters({ isStarred: undefined })
                                }
                                className="ml-1 hover:text-red-500"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    )}
                    {filters.isPublic && (
                        <Badge variant="secondary" className="gap-1">
                            Public
                            <button
                                onClick={() =>
                                    updateFilters({ isPublic: undefined })
                                }
                                className="ml-1 hover:text-red-500"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    )}
                </div>
            )}

            {/* Advanced Filters Panel */}
            {showAdvanced && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">
                            Advanced Filters
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* File Types */}
                        <div>
                            <Label className="text-sm font-medium">
                                File Types
                            </Label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                                {FILE_TYPES.map((fileType) => (
                                    <Button
                                        key={fileType.value}
                                        variant={
                                            filters.fileTypes.includes(
                                                fileType.value
                                            )
                                                ? "default"
                                                : "outline"
                                        }
                                        size="sm"
                                        onClick={() =>
                                            toggleFileType(fileType.value)
                                        }
                                        className="justify-start"
                                    >
                                        <FileType className="h-4 w-4 mr-2" />
                                        {fileType.label}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Date Range */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label className="text-sm font-medium">
                                    Date From
                                </Label>
                                <Popover
                                    open={dateFromOpen}
                                    onOpenChange={setDateFromOpen}
                                >
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start mt-2"
                                        >
                                            <CalendarIcon className="h-4 w-4 mr-2" />
                                            {filters.dateFrom
                                                ? format(
                                                      filters.dateFrom,
                                                      "MMM dd, yyyy"
                                                  )
                                                : "Select date"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={filters.dateFrom}
                                            onSelect={(date) => {
                                                updateFilters({
                                                    dateFrom: date,
                                                });
                                                setDateFromOpen(false);
                                            }}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div>
                                <Label className="text-sm font-medium">
                                    Date To
                                </Label>
                                <Popover
                                    open={dateToOpen}
                                    onOpenChange={setDateToOpen}
                                >
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start mt-2"
                                        >
                                            <CalendarIcon className="h-4 w-4 mr-2" />
                                            {filters.dateTo
                                                ? format(
                                                      filters.dateTo,
                                                      "MMM dd, yyyy"
                                                  )
                                                : "Select date"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={filters.dateTo}
                                            onSelect={(date) => {
                                                updateFilters({ dateTo: date });
                                                setDateToOpen(false);
                                            }}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        {/* Size Range */}
                        <div>
                            <Label className="text-sm font-medium">
                                File Size
                            </Label>
                            <Select onValueChange={setSizeRange}>
                                <SelectTrigger className="mt-2">
                                    <SelectValue placeholder="Select size range" />
                                </SelectTrigger>
                                <SelectContent>
                                    {SIZE_RANGES.map((range) => (
                                        <SelectItem
                                            key={range.value}
                                            value={range.value}
                                        >
                                            {range.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Tags */}
                        <div>
                            <Label className="text-sm font-medium">Tags</Label>
                            <div className="flex gap-2 mt-2">
                                <Input
                                    placeholder="Add tag..."
                                    value={tagInput}
                                    onChange={(e) =>
                                        setTagInput(e.target.value)
                                    }
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            addTag(tagInput);
                                        }
                                    }}
                                />
                                <Button
                                    onClick={() => addTag(tagInput)}
                                    disabled={!tagInput.trim()}
                                >
                                    Add
                                </Button>
                            </div>
                            {filters.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {filters.tags.map((tag) => (
                                        <Badge
                                            key={tag}
                                            variant="outline"
                                            className="gap-1"
                                        >
                                            {tag}
                                            <button
                                                onClick={() => removeTag(tag)}
                                                className="ml-1 hover:text-red-500"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Owner */}
                        <div>
                            <Label className="text-sm font-medium">Owner</Label>
                            <Input
                                placeholder="Filter by owner email..."
                                value={filters.owner || ""}
                                onChange={(e) =>
                                    updateFilters({
                                        owner: e.target.value || undefined,
                                    })
                                }
                                className="mt-2"
                            />
                        </div>

                        {/* Special Filters */}
                        <div className="flex flex-wrap gap-4">
                            <Button
                                variant={
                                    filters.isStarred ? "default" : "outline"
                                }
                                size="sm"
                                onClick={() =>
                                    updateFilters({
                                        isStarred:
                                            !filters.isStarred || undefined,
                                    })
                                }
                            >
                                ⭐ Starred Only
                            </Button>
                            <Button
                                variant={
                                    filters.isPublic ? "default" : "outline"
                                }
                                size="sm"
                                onClick={() =>
                                    updateFilters({
                                        isPublic:
                                            !filters.isPublic || undefined,
                                    })
                                }
                            >
                                🌐 Public Only
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
