import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Icons } from "./icons";

const MAX_STRING_LENGTH = 128;
const ARRAY_GROUP_SIZE = 50;

const LIGHT_COLORS = {
  string: "#2E7D32",
  number: "#B45309",
  boolean: "#0066CC",
  null: "#DC2626",
  undefined: "#DC2626",
  key: "#0066CC",
  punctuation: "#2D2D2D",
  background: "#FFFFFF",
  foreground: "#2D2D2D",
};

const DARK_COLORS = {
  string: "#C3E88D",
  number: "#FFB86C",
  boolean: "#82AAFF",
  null: "#FF8A9E",
  undefined: "#FF8A9E",
  key: "#82AAFF",
  punctuation: "#E8EAF2",
  background: "#101017",
  foreground: "#E8EAF2",
};

const MemoizedChevronDown = memo(Icons.chevronDown);
const MemoizedChevronRight = memo(Icons.chevronRight);
const MemoizedChevronUp = memo(Icons.chevronUp);
const MemoizedCopy = memo(Icons.copy);
const MemoizedCheck = memo(Icons.check);

export type JsonViewerProps = {
  json: unknown;
  className?: string;
  truncatedByDefault?: boolean;
  maxDepth?: number;
};

export const JsonViewer = memo(
  ({
    json,
    className,
    truncatedByDefault = true,
    maxDepth,
  }: JsonViewerProps) => {
    const [expandedPaths, setExpandedPaths] = useState<Map<string, boolean>>(
      new Map([["root", true]])
    );
    const containerRef = useRef<HTMLDivElement>(null);
    const { theme } = useTheme();
    const colors = theme === "dark" ? DARK_COLORS : LIGHT_COLORS;

    const shouldExpand = useCallback(
      (path: string) =>
        expandedPaths.get(path) ??
        (maxDepth ? path.split(".").length <= maxDepth : false),
      [expandedPaths, maxDepth]
    );

    const toggleExpand = useCallback(
      (path: string) =>
        setExpandedPaths((prev) =>
          new Map(prev).set(path, !shouldExpand(path))
        ),
      [shouldExpand]
    );

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const activeItems = new Set<HTMLElement>();
      const selector = "& > div > span > span > span[data-actions]";

      const handlePointerMove = (event: PointerEvent) => {
        const target = (event.target as HTMLElement).closest(
          ".item"
        ) as HTMLElement | null;
        if (target) {
          activeItems.add(target);
          const el = target.querySelector(selector) as HTMLElement | null;
          if (el) el.style.display = "inline";
        }

        activeItems.forEach((item) => {
          if (!item.contains(event.target as Node)) {
            activeItems.delete(item);
            const el = item.querySelector(selector) as HTMLElement | null;
            if (el) el.style.display = "none";
          }
        });
      };

      const handlePointerLeave = () => {
        activeItems.forEach((item) => {
          const el = item.querySelector(
            "& > span > span > span[data-actions]"
          ) as HTMLElement | null;
          if (el) el.style.display = "none";
        });
        activeItems.clear();
      };

      container.addEventListener("pointermove", handlePointerMove);
      container.addEventListener("pointerleave", handlePointerLeave);

      return () => {
        container.removeEventListener("pointermove", handlePointerMove);
        container.removeEventListener("pointerleave", handlePointerLeave);
        activeItems.clear();
      };
    }, []);

    return (
      <div
        ref={containerRef}
        style={{
          backgroundColor: colors.background,
          color: colors.foreground,
        }}
        className={cn(
          "w-full overflow-hidden rounded-sm border p-2 font-mono text-sm leading-[17px]",
          className
        )}
      >
        <JsonValue
          value={json}
          path="root"
          keyName={null}
          shouldExpand={shouldExpand}
          toggleExpand={toggleExpand}
          truncatedByDefault={truncatedByDefault}
        />
      </div>
    );
  }
);

JsonViewer.displayName = "JsonViewer";

type JsonValueProps = {
  value: unknown;
  path: string;
  keyName: string | null;
  truncatedByDefault: boolean;
  shouldExpand: (path: string) => boolean;
  toggleExpand: (path: string) => void;
};

const JsonValue = memo(
  ({
    value,
    path,
    keyName,
    truncatedByDefault,
    shouldExpand,
    toggleExpand,
  }: JsonValueProps) => {
    const [isTruncated, setIsTruncated] = useState(truncatedByDefault);
    const [showCopyCheck, setShowCopyCheck] = useState(false);
    const valueRef = useRef(value);
    valueRef.current = value;
    const { theme } = useTheme();
    const colors = theme === "dark" ? DARK_COLORS : LIGHT_COLORS;
    const copyTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

    const objectChars = getObjectChars(value);
    const isObjectValue = isObject(value);
    const valueString = !isObjectValue
      ? (JSON.stringify(value)?.toString() ?? "undefined")
      : null;

    const isExpanded = shouldExpand(path);

    const handleToggle = useCallback(
      (event: React.MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();
        if (isObjectValue) {
          toggleExpand(path);
        }
      },
      [path, toggleExpand, isObjectValue]
    );

    const handleCopy = useCallback(async (event: React.MouseEvent) => {
      event.stopPropagation();
      event.preventDefault();
      await navigator.clipboard.writeText(
        typeof valueRef.current === "string"
          ? valueRef.current
          : JSON.stringify(valueRef.current, null, 2)
      );
      setShowCopyCheck(true);

      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
      copyTimeoutRef.current = setTimeout(() => setShowCopyCheck(false), 1000);
    }, []);

    const handleTruncateToggle = useCallback((event: React.MouseEvent) => {
      const isInsideLink = (event.target as HTMLElement).closest("a");

      if (!isInsideLink) {
        event.stopPropagation();
        event.preventDefault();
      }

      setIsTruncated((prev) => !prev);
    }, []);

    useEffect(() => {
      return () => {
        if (copyTimeoutRef.current) {
          clearTimeout(copyTimeoutRef.current);
        }
      };
    }, []);

    const renderValue = () => {
      if (
        truncatedByDefault &&
        typeof value === "string" &&
        value.length > MAX_STRING_LENGTH
      ) {
        const displayValue = isTruncated
          ? `${valueString!.slice(0, MAX_STRING_LENGTH)}..."`
          : valueString;

        return (
          <span
            className="cursor-pointer break-all"
            onClick={handleTruncateToggle}
            title={isTruncated ? "Click to expand" : "Click to truncate"}
          >
            {displayValue}
          </span>
        );
      }

      return valueString;
    };

    const renderValueWrapper = () => {
      if (
        typeof value === "string" &&
        (value.startsWith("https://") || value.startsWith("http://"))
      ) {
        return (
          <a
            onClick={(e) => e.stopPropagation()}
            href={value}
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2"
          >
            {renderValue()}
          </a>
        );
      }
      return renderValue();
    };

    const renderArrayGroup = (start: number, end: number) => {
      return (
        <div key={`${path}.${start}-${end}`}>
          <span
            className="cursor-pointer"
            style={{ color: colors.punctuation }}
            onClick={() => toggleExpand(`${path}.${start}-${end}`)}
          >
            {shouldExpand(`${path}.${start}-${end}`) ? (
              <MemoizedChevronDown className="mr-1 inline-block size-3 select-none" />
            ) : (
              <MemoizedChevronRight className="mr-1 inline-block size-3 select-none" />
            )}
            [{start}...{end}]
          </span>
          {shouldExpand(`${path}.${start}-${end}`) && (
            <div className="ml-4">
              {(value as unknown[]).slice(start, end + 1).map((v, i) => (
                <JsonValue
                  key={start + i}
                  value={v}
                  path={`${path}.${start + i}`}
                  keyName={(start + i).toString()}
                  shouldExpand={shouldExpand}
                  toggleExpand={toggleExpand}
                  truncatedByDefault={truncatedByDefault}
                />
              ))}
            </div>
          )}
        </div>
      );
    };

    return (
      <div className="item relative flex flex-col">
        <div className="items-start">
          {keyName !== null && (
            <span style={{ color: colors.key }} className="mr-2">
              {keyName}
              <span style={{ color: colors.punctuation }}>:</span>
            </span>
          )}
          <span className="relative">
            <span
              className="relative mr-1 cursor-pointer break-words"
              onClick={isObjectValue ? handleToggle : handleTruncateToggle}
              style={
                !isObjectValue
                  ? {
                      color:
                        colors[typeof value as keyof typeof colors] ||
                        colors.foreground,
                    }
                  : { color: colors.punctuation }
              }
            >
              {isObjectValue ? (
                !isExpanded ? (
                  <span className="select-none">
                    {objectChars[0]}...{objectChars[1]}
                  </span>
                ) : (
                  <span className="select-none">{objectChars[0]}</span>
                )
              ) : (
                renderValueWrapper()
              )}
              <span data-actions className="hidden">
                {isObjectValue &&
                  (isExpanded ? (
                    <MemoizedChevronUp
                      onClick={handleToggle}
                      className="ml-1 inline size-3 cursor-pointer select-none"
                    />
                  ) : (
                    <MemoizedChevronDown
                      onClick={handleToggle}
                      className="ml-1 inline size-3 cursor-pointer select-none"
                    />
                  ))}
                {showCopyCheck ? (
                  <MemoizedCheck
                    className="ml-1 inline size-2.5 select-none"
                    style={{ color: colors.foreground }}
                  />
                ) : (
                  <MemoizedCopy
                    className="ml-1 inline size-2.5 cursor-pointer select-none active:opacity-80"
                    style={{ color: colors.foreground }}
                    onClick={handleCopy}
                  />
                )}
              </span>
            </span>
          </span>
        </div>
        {isExpanded && isObjectValue && (
          <div className="ml-4">
            {isArray(value) && value.length > ARRAY_GROUP_SIZE
              ? Array.from(
                  { length: Math.ceil(value.length / ARRAY_GROUP_SIZE) },
                  (_, i) => {
                    const start = i * ARRAY_GROUP_SIZE;
                    const end = Math.min(
                      start + ARRAY_GROUP_SIZE - 1,
                      value.length - 1
                    );
                    return renderArrayGroup(start, end);
                  }
                )
              : Object.entries(value).map(([k, v]) => (
                  <JsonValue
                    key={k}
                    value={v}
                    path={`${path}.${k}`}
                    keyName={k}
                    shouldExpand={shouldExpand}
                    toggleExpand={toggleExpand}
                    truncatedByDefault={truncatedByDefault}
                  />
                ))}
          </div>
        )}
        {isObjectValue && isExpanded && (
          <span style={{ color: colors.punctuation }} className="select-none">
            {objectChars[1]}
          </span>
        )}
      </div>
    );
  }
);

JsonValue.displayName = "JsonValue";

const isObject = (value: unknown): value is object =>
  typeof value === "object" && value !== null;
const isArray = Array.isArray;
const getObjectChars = (value: unknown): [string, string] =>
  isArray(value) ? ["[", "]"] : isObject(value) ? ["{", "}"] : ["", ""];
