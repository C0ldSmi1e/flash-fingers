"use client";

const AboutTab = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Flash Fingers</h3>
        <div className="space-y-4 text-sm">
          <div>
            <p className="font-medium">Version: 1.0.0</p>
          </div>
          <div>
            <p className="text-muted-foreground">
              A minimalist typing speed test designed to help you improve your typing skills 
              while maintaining focus and flow.
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">
              Built with Next.js, React, and shadcn/ui for a modern, accessible typing experience.
            </p>
          </div>
          <div className="pt-4 border-t border-border">
            <h4 className="font-medium mb-2">Features</h4>
            <ul className="text-muted-foreground space-y-1 list-disc list-inside">
              <li>Real-time typing speed tracking</li>
              <li>Accuracy measurement</li>
              <li>Progress visualization</li>
              <li>Customizable color themes</li>
              <li>Minimalist, distraction-free interface</li>
            </ul>
          </div>
          <div className="pt-4 border-t border-border">
            <h4 className="font-medium mb-2">Technology Stack</h4>
            <ul className="text-muted-foreground space-y-1 list-disc list-inside">
              <li>Next.js 15</li>
              <li>React 19</li>
              <li>TypeScript</li>
              <li>Tailwind CSS</li>
              <li>shadcn/ui</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export { AboutTab };