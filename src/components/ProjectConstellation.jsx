// src/components/ProjectConstellation.jsx
import React, { useEffect, useRef, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";

// Define project type colors (including an explicit “Other”)
const typeColors = {
  Writing: "#ff6b6b",
  Technology: "#48dbfb",
  Music: "#1dd1a1",
  Art: "#feca57",
  Business: "#5f27cd",
  Personal: "#ff9ff3",
  Science: "#54a0ff",
  Other: "#c8d6e5",
  Default: "#c8d6e5",
};

export default function ProjectConstellation({ projects }) {
  const fgRef = useRef();
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [hoveredNode, setHoveredNode] = useState(null);

  useEffect(() => {
    if (!projects?.length) return;

    // Build nodes
    const nodes = projects.map((project, idx) => {
      const type = project.properties?.Type?.select?.name || "Default";
      return {
        id: project.id || `node-${idx}`,
        name: project.properties?.Name?.title?.[0]?.plain_text || "Untitled",
        type,
        description:
          project.properties?.Description?.rich_text?.[0]?.plain_text || "",
        status: project.properties?.Status?.select?.name || "Unknown",
        timeline: project.properties?.Timeline?.date,
        // smaller, more predictable random size
        size: 5 + Math.random() * 6,
        color: typeColors[type] || typeColors.Default,
      };
    });

    // Build random links
    const links = [];
    nodes.forEach((node, i) => {
      const numLinks = Math.floor(Math.random() * 3) + 1;
      for (let j = 0; j < numLinks; j++) {
        const targetIdx = Math.floor(Math.random() * nodes.length);
        if (targetIdx !== i) {
          links.push({
            source: node.id,
            target: nodes[targetIdx].id,
            value: Math.random() * 5 + 1,
          });
        }
      }
    });

    setGraphData({ nodes, links });
  }, [projects]);

  // Zoom/focus logic on click
  const handleNodeClick = (node) => {
    if (!fgRef.current) return;
    const distance = 40;
    const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z || 1);
    fgRef.current.centerAt(node.x * distRatio, node.y * distRatio, 1000);
    fgRef.current.zoom(2.5, 1000);
  };

  return (
    <div className="relative w-full h-full">
      <ForceGraph2D
        ref={fgRef}
        graphData={graphData}
        // ensure full fill of parent container
        style={{ width: "100%", height: "100%" }}
        // smaller relative size so nodes aren’t gigantic
        nodeRelSize={3}
        nodeVal={(node) => node.size}
        nodeLabel={(node) => `${node.name} (${node.status})`}
        nodeColor={(node) => node.color}
        linkWidth={(link) => Math.sqrt(link.value)}
        linkColor={() => "rgba(255,255,255,0.2)"}
        onNodeHover={setHoveredNode}
        onNodeClick={handleNodeClick}
        cooldownTicks={100}
        linkDirectionalParticles={1}
        linkDirectionalParticleWidth={2}
        d3AlphaDecay={0.02}
        d3VelocityDecay={0.3}
        backgroundColor="#111827"
      />

      {hoveredNode && (
        <div className="absolute top-4 right-4 bg-gray-800 bg-opacity-80 text-white p-4 rounded-lg shadow-lg max-w-xs backdrop-blur-sm border border-gray-700">
          <h3 className="text-xl font-bold mb-2">{hoveredNode.name}</h3>
          <div className="text-sm mb-2">
            <span
              className="inline-block px-2 py-1 rounded-full text-xs"
              style={{ backgroundColor: hoveredNode.color }}
            >
              {hoveredNode.type}
            </span>
            <span className="ml-2 inline-block px-2 py-1 bg-gray-700 rounded-full text-xs">
              {hoveredNode.status}
            </span>
          </div>
          <p className="text-gray-300 text-sm">{hoveredNode.description}</p>
          {hoveredNode.timeline && (
            <div className="mt-2 text-xs text-gray-400">
              {hoveredNode.timeline.start && (
                <span>
                  Started: {new Date(hoveredNode.timeline.start).toLocaleDateString()}
                </span>
              )}
              {hoveredNode.timeline.end && (
                <span className="ml-2">
                  Ended: {new Date(hoveredNode.timeline.end).toLocaleDateString()}
                </span>
              )}
            </div>
          )}
          <a
            href={`/projects/${hoveredNode.id}`}
            className="mt-3 inline-block px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors"
          >
            View Details
          </a>
        </div>
      )}
    </div>
  );
}