// components/BarChart.tsx
"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";

interface Category {
  categoryId: string;
  name: string;
  amount: number;
}

interface BarChartProps {
  data: Category[];
}

export default function BarChart({ data }: BarChartProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const container = containerRef.current;
    const svg = d3.select(svgRef.current);
    if (!container || !svg) return;

    const resizeObserver = new ResizeObserver(() => drawChart());
    resizeObserver.observe(container);

    function drawChart() {
      svg.selectAll("*").remove();

      const containerWidth = container?.clientWidth ?? 400;
      const margin = { top: 20, right: 30, bottom: 50, left: 60 };
      const width = containerWidth - margin.left - margin.right;
      const height = 400 - margin.top - margin.bottom;

      const chart = svg
        .attr("width", containerWidth)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      const x = d3
        .scaleBand()
        .domain(data.map((d) => d.name))
        .range([0, width])
        .padding(0.3);

      const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.amount)!])
        .nice()
        .range([height, 0]);

      chart
        .append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

      chart.append("g").call(d3.axisLeft(y));

      chart
        .selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", (d) => x(d.name)!)
        .attr("y", (d) => y(d.amount))
        .attr("width", x.bandwidth())
        .attr("height", (d) => height - y(d.amount))
        .attr("fill", "#3b82f6");
    }

    drawChart();

    return () => resizeObserver.disconnect();
  }, [data]);

  return (
    <div ref={containerRef} className="w-full overflow-x-auto">
      <svg ref={svgRef} className="w-full h-auto"></svg>
    </div>
  );
}
