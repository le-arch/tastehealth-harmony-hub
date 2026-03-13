import * as React from "react"
import * as RechartsPrimitive from "recharts"
import { motion, AnimatePresence } from "framer-motion"

import { cn } from "@/lib/utils"

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
}

type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }

  return context
}

// Animation variants for chart container
const chartContainerVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  },
  hover: {
    scale: 1.01,
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  }
}

// Animation variants for tooltip
const tooltipVariants = {
  initial: { opacity: 0, scale: 0.9, y: 10 },
  animate: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 300
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.9, 
    y: 10,
    transition: {
      duration: 0.2
    }
  }
}

// Animation variants for legend items
const legendItemVariants = {
  initial: { opacity: 0, x: -10 },
  animate: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3,
      ease: "easeOut"
    }
  }),
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  }
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig
    children: React.ComponentProps<
      typeof RechartsPrimitive.ResponsiveContainer
    >["children"]
    animated?: boolean
  }
>(({ id, className, children, config, animated = true, ...props }, ref) => {
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`
  const [isHovered, setIsHovered] = React.useState(false)

  const baseClasses = cn(
    "flex aspect-video justify-center text-xs relative overflow-hidden",
    "rounded-xl bg-gradient-to-br from-background/50 to-muted/30",
    "backdrop-blur-sm border border-border/50",
    "shadow-lg hover:shadow-xl transition-shadow duration-300",
    "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground",
    "[&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50",
    "[&_.recharts-curve.recharts-tooltip-cursor]:stroke-border",
    "[&_.recharts-dot[stroke='#fff']]:stroke-transparent",
    "[&_.recharts-layer]:outline-none",
    "[&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border",
    "[&_.recharts-radial-bar-background-sector]:fill-muted",
    "[&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted/50",
    "[&_.recharts-reference-line_[stroke='#ccc']]:stroke-border",
    "[&_.recharts-sector[stroke='#fff']]:stroke-transparent",
    "[&_.recharts-sector]:outline-none",
    "[&_.recharts-surface]:outline-none",
    className
  )

  if (!animated) {
    return (
      <div
        data-chart={chartId}
        ref={ref}
        className={baseClasses}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-tr from-destructive/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    )
  }

  return (
    <ChartContext.Provider value={{ config }}>
      <motion.div
        data-chart={chartId}
        ref={ref}
        variants={chartContainerVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className={baseClasses}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        
        {/* Animated gradient background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none"
          animate={{
            opacity: isHovered ? 0.8 : 0.3,
            scale: isHovered ? 1.02 : 1,
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />

        {/* Decorative animated orbs */}
        <motion.div
          className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-full blur-3xl pointer-events-none"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 10, 0],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-tr from-destructive/20 via-destructive/10 to-transparent rounded-full blur-3xl pointer-events-none"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
            x: [0, -10, 0],
            y: [0, 10, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />

        {/* Shimmer effect on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"
          initial={{ x: "-100%" }}
          animate={isHovered ? { x: "100%" } : { x: "-100%" }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />

        {/* Corner accents */}
        <motion.div
          className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-primary/20 to-transparent rounded-br-3xl pointer-events-none"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5, ease: "easeInOut" }}
        />
        
        <motion.div
          className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-primary/20 to-transparent rounded-tl-3xl pointer-events-none"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5, ease: "easeInOut" }}
        />

        {/* Main chart content */}
        <div className="relative z-10 w-full h-full">
          <RechartsPrimitive.ResponsiveContainer>
            {children}
          </RechartsPrimitive.ResponsiveContainer>
        </div>

        {/* Pulsing border effect */}
        <motion.div
          className="absolute inset-0 rounded-xl border-2 border-primary/0 pointer-events-none"
          animate={{
            borderColor: isHovered ? "rgba(147, 51, 234, 0.3)" : "rgba(147, 51, 234, 0)",
            boxShadow: isHovered ? "0 0 30px rgba(147, 51, 234, 0.2)" : "0 0 0 rgba(147, 51, 234, 0)",
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </ChartContext.Provider>
  )
})
ChartContainer.displayName = "Chart"

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([_, config]) => config.theme || config.color
  )

  if (!colorConfig.length) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
      itemConfig.color
    return color ? `  --color-${key}: ${color};` : null
  })
  .join("\n")}
}
`
          )
          .join("\n"),
      }}
    />
  )
}

const ChartTooltip = RechartsPrimitive.Tooltip

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
    React.ComponentProps<"div"> & {
      hideLabel?: boolean
      hideIndicator?: boolean
      indicator?: "line" | "dot" | "dashed"
      nameKey?: string
      labelKey?: string
      animated?: boolean
    }
>(
  (
    {
      active,
      payload,
      className,
      indicator = "dot",
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey,
      labelKey,
      animated = true,
    },
    ref
  ) => {
    const { config } = useChart()

    if (!active || !payload?.length) {
      return null
    }

    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.length) {
        return null
      }

      const [item] = payload
      const key = `${labelKey || item.dataKey || item.name || "value"}`
      const itemConfig = getPayloadConfigFromPayload(config, item, key)
      const value =
        !labelKey && typeof label === "string"
          ? config[label as keyof typeof config]?.label || label
          : itemConfig?.label

      if (labelFormatter) {
        return (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={cn("font-medium", labelClassName)}
          >
            {labelFormatter(value, payload)}
          </motion.div>
        )
      }

      if (!value) {
        return null
      }

      return (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={cn("font-medium", labelClassName)}
        >
          {value}
        </motion.div>
      )
    }, [
      label,
      labelFormatter,
      payload,
      hideLabel,
      labelClassName,
      config,
      labelKey,
    ])

    const Content = animated ? motion.div : 'div'
    const contentProps = animated ? {
      variants: tooltipVariants,
      initial: "initial",
      animate: "animate",
      exit: "exit"
    } : {}

    return (
      <AnimatePresence mode="wait">
        <Content
          ref={ref}
          className={cn(
            "grid min-w-[12rem] items-start gap-2 rounded-xl",
            "bg-gradient-to-br from-background to-muted/90",
            "border border-primary/20 shadow-2xl",
            "backdrop-blur-md",
            "px-3 py-2.5 text-xs",
            className
          )}
          {...contentProps}
        >
          {tooltipLabel}
          <motion.div 
            className="grid gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, staggerChildren: 0.05 }}
          >
            {payload.map((item, index) => {
              const key = `${nameKey || item.name || item.dataKey || "value"}`
              const itemConfig = getPayloadConfigFromPayload(config, item, key)
              const indicatorColor = color || item.payload.fill || item.color

              return (
                <motion.div
                  key={item.dataKey}
                  variants={{
                    initial: { opacity: 0, x: -10 },
                    animate: { opacity: 1, x: 0 }
                  }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    "flex w-full flex-wrap items-stretch gap-2",
                    "[&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground",
                    indicator === "dot" && "items-center"
                  )}
                >
                  {formatter && item?.value !== undefined && item.name ? (
                    formatter(item.value, item.name, item, index, item.payload)
                  ) : (
                    <>
                      {itemConfig?.icon ? (
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <itemConfig.icon />
                        </motion.div>
                      ) : (
                        !hideIndicator && (
                          <motion.div
                            className={cn(
                              "shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]",
                              {
                                "h-2.5 w-2.5": indicator === "dot",
                                "w-1": indicator === "line",
                                "w-0 border-[1.5px] border-dashed bg-transparent":
                                  indicator === "dashed",
                              }
                            )}
                            style={
                              {
                                "--color-bg": indicatorColor,
                                "--color-border": indicatorColor,
                              } as React.CSSProperties
                            }
                            animate={{
                              scale: [1, 1.2, 1],
                            }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          />
                        )
                      )}
                      <div className="flex flex-1 justify-between leading-none">
                        <span className="text-muted-foreground">
                          {itemConfig?.label || item.name}
                        </span>
                        {item.value && (
                          <motion.span
                            className="font-mono font-medium tabular-nums text-foreground"
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 400 }}
                          >
                            {item.value.toLocaleString()}
                          </motion.span>
                        )}
                      </div>
                    </>
                  )}
                </motion.div>
              )
            })}
          </motion.div>
        </Content>
      </AnimatePresence>
    )
  }
)
ChartTooltipContent.displayName = "ChartTooltip"

const ChartLegend = RechartsPrimitive.Legend

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> &
    Pick<RechartsPrimitive.LegendProps, "payload" | "verticalAlign"> & {
      hideIcon?: boolean
      nameKey?: string
      animated?: boolean
    }
>(
  (
    { className, hideIcon = false, payload, verticalAlign = "bottom", nameKey, animated = true },
    ref
  ) => {
    const { config } = useChart()

    if (!payload?.length) {
      return null
    }

    const Component = animated ? motion.div : 'div'
    const componentProps = animated ? {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: 0.3 }
    } : {}

    return (
      <Component
        ref={ref}
        className={cn(
          "flex items-center justify-center gap-4 flex-wrap",
          verticalAlign === "top" ? "pb-3" : "pt-3",
          className
        )}
        {...componentProps}
      >
        {payload.map((item, index) => {
          const key = `${nameKey || item.dataKey || "value"}`
          const itemConfig = getPayloadConfigFromPayload(config, item, key)

          return (
            <motion.div
              key={item.value}
              variants={legendItemVariants}
              custom={index}
              initial="initial"
              animate="animate"
              whileHover="hover"
              className={cn(
                "flex items-center gap-1.5 px-2 py-1 rounded-md",
                "hover:bg-muted/50 transition-colors cursor-default",
                "[&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground"
              )}
            >
              {itemConfig?.icon && !hideIcon ? (
                <motion.div
                  whileHover={{ rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <itemConfig.icon />
                </motion.div>
              ) : (
                <motion.div
                  className="h-2 w-2 shrink-0 rounded-[2px]"
                  style={{
                    backgroundColor: item.color,
                  }}
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.2,
                    ease: "easeInOut"
                  }}
                />
              )}
              <span className="text-xs font-medium">{itemConfig?.label}</span>
            </motion.div>
          )
        })}
      </Component>
    )
  }
)
ChartLegendContent.displayName = "ChartLegend"

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string
) {
  if (typeof payload !== "object" || payload === null) {
    return undefined
  }

  const payloadPayload =
    "payload" in payload &&
    typeof payload.payload === "object" &&
    payload.payload !== null
      ? payload.payload
      : undefined

  let configLabelKey: string = key

  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === "string"
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string
  }

  return configLabelKey in config
    ? config[configLabelKey]
    : config[key as keyof typeof config]
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
}