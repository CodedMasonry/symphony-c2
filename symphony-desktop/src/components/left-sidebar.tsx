import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  fetchObjects,
  ObjectWithUlid,
  getDesignationName,
} from "@/lib/proto_api";
import { ObjectDesignation } from "@/lib/generated/base";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { RefreshCw, Loader2, MapPin, Compass } from "lucide-react";

function LeftSidebar({ className, ...props }: React.ComponentProps<"div">) {
  const [objects, setObjects] = useState<ObjectWithUlid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadObjects();
  }, []);

  const loadObjects = async () => {
    try {
      setLoading(true);
      const data = await fetchObjects();
      setObjects(data);
      setError(null);
    } catch (err) {
      console.error("Failed to load objects:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={cn("flex flex-col h-full bg-background", className)}
      {...props}
    >
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Objects</h2>
            <p className="text-sm text-muted-foreground">
              {objects.length} active
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={loadObjects}
            disabled={loading}
          >
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </Button>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {loading && objects.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <Card className="border-destructive">
              <CardContent className="pt-6">
                <p className="text-sm text-destructive mb-4">{error}</p>
                <Button
                  onClick={loadObjects}
                  variant="outline"
                  className="w-full"
                >
                  Retry
                </Button>
              </CardContent>
            </Card>
          ) : objects.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">No objects found</p>
            </div>
          ) : (
            objects.map((obj) => (
              <Card
                key={obj.ulidString}
                className="bg-accent/20 hover:bg-accent/40 transition-colors cursor-pointer"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-sm font-medium">
                      {getDesignationName(obj.designation)}
                    </CardTitle>
                    <Badge
                      variant={getDesignationVariant(obj.designation)}
                      className={getDesignationColor(obj.designation)}
                    >
                      {getDesignationBadge(obj.designation)}
                    </Badge>
                  </div>
                  <code className="text-xs text-muted-foreground font-mono">
                    {obj.ulidString.slice(0, 13)}...
                  </code>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>
                      {obj.latitude.toFixed(4)}°, {obj.longitude.toFixed(4)}°
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center text-muted-foreground">
                      <Compass className="h-3 w-3 mr-1" />
                      <span>{obj.heading.toFixed(0)}°</span>
                    </div>
                    <span className="text-muted-foreground">
                      {obj.altitude.toFixed(0)}m
                    </span>
                  </div>
                  <Separator />
                  <p className="text-xs text-muted-foreground">
                    {formatTimestamp(obj.createdAt)}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

function getDesignationVariant(
  designation: ObjectDesignation,
): "default" | "destructive" | "outline" | "secondary" {
  switch (designation) {
    case ObjectDesignation.OBJECT_DESIGNATION_HOSTILE:
      return "destructive";
    case ObjectDesignation.OBJECT_DESIGNATION_FRIENDLY:
    case ObjectDesignation.OBJECT_DESIGNATION_ALLY:
      return "secondary"; // Use secondary as base, will override color with className
    case ObjectDesignation.OBJECT_DESIGNATION_CIVILIAN:
      return "secondary";
    case ObjectDesignation.OBJECT_DESIGNATION_UNSPECIFIED:
    default:
      return "outline";
  }
}

function getDesignationColor(designation: ObjectDesignation): string {
  switch (designation) {
    case ObjectDesignation.OBJECT_DESIGNATION_HOSTILE:
      return "";
    case ObjectDesignation.OBJECT_DESIGNATION_FRIENDLY:
    case ObjectDesignation.OBJECT_DESIGNATION_ALLY:
      return "bg-blue-500/20 text-blue-400";
    case ObjectDesignation.OBJECT_DESIGNATION_CIVILIAN:
      return "bg-gray-500/20 text-gray-400";
    case ObjectDesignation.OBJECT_DESIGNATION_UNSPECIFIED:
    default:
      return ""; // outline variant is fine
  }
}

function getDesignationBadge(designation: ObjectDesignation): string {
  switch (designation) {
    case ObjectDesignation.OBJECT_DESIGNATION_HOSTILE:
      return "HST";
    case ObjectDesignation.OBJECT_DESIGNATION_FRIENDLY:
      return "FRD";
    case ObjectDesignation.OBJECT_DESIGNATION_ALLY:
      return "ALY";
    case ObjectDesignation.OBJECT_DESIGNATION_CIVILIAN:
      return "CIV";
    case ObjectDesignation.OBJECT_DESIGNATION_UNSPECIFIED:
    default:
      return "UNK";
  }
}

function formatTimestamp(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "just now";
}

export { LeftSidebar };
