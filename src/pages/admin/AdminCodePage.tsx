import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Code2, 
  Folder, 
  FileCode, 
  Save, 
  Eye, 
  GitBranch, 
  Rocket, 
  Lock, 
  Unlock, 
  Check, 
  Play, 
  Terminal, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle,
  RotateCw,
  GitMerge,
  Smartphone
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { Modal } from '../../components/common/Modal';
import { DeviceMockup } from '../../components/common/DeviceMockup';

export const AdminCodePage: React.FC = () => {
  const { 
    currentUser, 
    codeFiles, 
    activeFilePath, 
    setActiveFilePath, 
    updateFileContent, 
    currentBranch, 
    branches, 
    createBranch, 
    switchBranch, 
    addNotification, 
    addActivity 
  } = useApp();

  const hasCodeEditor = currentUser.permissions.codeEditor;
  const canDeploy = currentUser.permissions.deployProduction;
  const canMerge = currentUser.permissions.mergeToProduction;

  // Local state for modals & actions
  const [createBranchModalOpen, setCreateBranchModalOpen] = useState(false);
  const [newBranchInput, setNewBranchInput] = useState('feature/homepage-update');
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [deployModalOpen, setDeployModalOpen] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployStep, setDeployStep] = useState(0);

  // Active code file
  const activeFile = codeFiles.find(f => f.path === activeFilePath) || codeFiles[0];

  // If Code Editor permission is OFF: Show Locked UI
  if (!hasCodeEditor) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-6 border border-amber-500/20 shadow-xl">
          <Lock className="w-8 h-8" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
          Permission Restricted
        </span>
        <h2 className="text-2xl font-black text-white tracking-tight mb-3">
          Code Editor Access Locked
        </h2>
        <p className="text-xs text-slate-400 leading-relaxed mb-6">
          Your current persona (<strong>{currentUser.name}</strong>, Role: <strong>{currentUser.role}</strong>) does not have the <strong>"Code Editor"</strong> permission enabled in the Studio security policy.
        </p>
        
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300 w-full mb-6 text-left space-y-2">
          <span className="font-semibold text-white block">How to test this prototype:</span>
          <p className="text-[11px] text-slate-400">
            1. Go to <Link to="/admin/users" className="text-sky-400 underline font-semibold">Team & Permissions</Link><br />
            2. Open permissions for your user and check <strong>"Code Editor"</strong>.<br />
            3. Or switch your active persona to <strong>Alex Rivera (Owner)</strong> or <strong>Marcus Vance (Developer)</strong> in the top header.
          </p>
        </div>

        <Link
          to="/admin/users"
          className="px-6 py-2.5 rounded-xl bg-sky-500 text-slate-950 font-bold text-xs hover:bg-sky-400 transition-colors shadow-lg shadow-sky-500/20"
        >
          Manage Permissions Matrix
        </Link>
      </div>
    );
  }

  // Handle Save
  const handleSaveChanges = () => {
    addNotification('Changes saved to local buffer.', 'success');
    addActivity({
      user: currentUser.name,
      avatar: currentUser.avatar,
      action: `Saved modifications in`,
      target: activeFile.path,
      type: 'code',
    });
  };

  // Handle Create Branch
  const handleCreateBranchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newBranchInput.trim()) {
      createBranch(newBranchInput.trim());
      setCreateBranchModalOpen(false);
    }
  };

  // Handle Deploy Simulation
  const handleStartDeploy = () => {
    setIsDeploying(true);
    setDeployStep(1);

    setTimeout(() => setDeployStep(2), 700);
    setTimeout(() => setDeployStep(3), 1400);
    setTimeout(() => setDeployStep(4), 2100);
    setTimeout(() => {
      setIsDeploying(false);
      setDeployStep(5);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      addNotification('Production release successfully simulated!', 'success');
      addActivity({
        user: currentUser.name,
        avatar: currentUser.avatar,
        action: `Simulated production deployment`,
        target: `Branch ${currentBranch}`,
        type: 'deploy',
      });
    }, 2800);
  };

  // File structure tree
  const fileTree = [
    {
      folder: 'app',
      files: [
        { name: 'page.tsx', path: 'app/page.tsx' },
        { name: 'about/page.tsx', path: 'app/about/page.tsx' },
        { name: 'projects/page.tsx', path: 'app/projects/page.tsx' },
      ],
    },
    {
      folder: 'components',
      files: [
        { name: 'Navbar.tsx', path: 'components/Navbar.tsx' },
        { name: 'ProjectCard.tsx', path: 'components/ProjectCard.tsx' },
        { name: 'Footer.tsx', path: 'components/Footer.tsx' },
      ],
    },
    {
      folder: 'lib',
      files: [
        { name: 'mock-data.ts', path: 'lib/mock-data.ts' },
      ],
    },
  ];

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-slate-950 text-slate-100 overflow-hidden">
      
      {/* Top IDE Toolbar */}
      <div className="h-14 px-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
        
        {/* Left: Branch Selector & File Path */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <GitBranch className="w-3.5 h-3.5 text-sky-400" />
            <select
              value={currentBranch}
              onChange={(e) => switchBranch(e.target.value)}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer text-xs"
            >
              {branches.map(b => (
                <option key={b} value={b} className="bg-slate-900 text-white">{b}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setCreateBranchModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            <GitBranch className="w-3.5 h-3.5 text-sky-400" />
            <span>Create Branch</span>
          </button>

          <span className="hidden md:inline-block text-xs font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-950 border border-slate-800/80">
            {activeFile.path}
          </span>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2">
          
          {/* Save Changes */}
          <button
            onClick={handleSaveChanges}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700/60"
          >
            <Save className="w-3.5 h-3.5 text-emerald-400" />
            <span>Save Changes</span>
          </button>

          {/* Preview */}
          <button
            onClick={() => setPreviewModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700/60"
          >
            <Eye className="w-3.5 h-3.5 text-sky-400" />
            <span>Preview</span>
          </button>

          {/* Merge to Production */}
          <button
            disabled={!canMerge}
            onClick={() => addNotification('Branch merged to main (Simulation)', 'info')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              canMerge
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-500 shadow-sm'
                : 'bg-slate-900 text-slate-500 border-slate-800 cursor-not-allowed opacity-60'
            }`}
            title={canMerge ? 'Merge current branch into main' : 'Locked: Requires Merge to Production permission'}
          >
            {canMerge ? <GitMerge className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5 text-amber-500" />}
            <span>Merge</span>
          </button>

          {/* Deploy Production */}
          <button
            disabled={!canDeploy}
            onClick={() => setDeployModalOpen(true)}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md ${
              canDeploy
                ? 'bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-sky-500/20 hover:scale-105'
                : 'bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed opacity-60'
            }`}
            title={canDeploy ? 'Deploy production release' : 'Locked: Requires Deploy Production permission'}
          >
            {canDeploy ? <Rocket className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5 text-amber-500" />}
            <span>Deploy</span>
          </button>

        </div>

      </div>

      {/* Main IDE Workspace: File Explorer on Left, Editor in Center */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left: File Explorer */}
        <div className="w-60 bg-slate-900/60 border-r border-slate-800/80 flex flex-col shrink-0">
          <div className="p-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
            Explorer : ApexMobile
          </div>

          <div className="p-2 space-y-4 overflow-y-auto flex-1 text-xs">
            {fileTree.map((group) => (
              <div key={group.folder} className="space-y-1">
                <div className="flex items-center gap-1.5 text-slate-400 font-semibold px-2 py-1">
                  <Folder className="w-3.5 h-3.5 text-amber-400" />
                  <span>{group.folder}/</span>
                </div>

                <div className="pl-4 space-y-0.5">
                  {group.files.map((file) => (
                    <button
                      key={file.path}
                      onClick={() => setActiveFilePath(file.path)}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-colors font-mono text-[11px] ${
                        activeFilePath === file.path
                          ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/30'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                      }`}
                    >
                      <FileCode className="w-3.5 h-3.5 text-sky-400" />
                      <span className="truncate">{file.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Terminal status indicator */}
          <div className="p-2.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              TypeScript 6.0 OK
            </span>
            <span>UTF-8</span>
          </div>
        </div>

        {/* Center: Monaco-Style Code Editor */}
        <div className="flex-1 flex flex-col bg-[#0d1117] overflow-hidden">
          
          {/* Active Tab bar */}
          <div className="h-9 bg-[#161b22] border-b border-slate-800 flex items-center px-2 gap-1 overflow-x-auto">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0d1117] text-white text-xs font-mono rounded-t-md border-t-2 border-sky-500 border-x border-slate-800 shrink-0">
              <FileCode className="w-3.5 h-3.5 text-sky-400" />
              <span>{activeFile.name}</span>
            </div>
          </div>

          {/* Code Text Area with Line Numbers */}
          <div className="flex-1 flex overflow-hidden font-mono text-xs">
            
            {/* Line numbers gutter */}
            <div className="w-12 bg-[#0d1117] text-slate-600 select-none py-4 text-right pr-3 font-mono text-[11px] leading-6 border-r border-slate-800/60 shrink-0">
              {Array.from({ length: 30 }).map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>

            {/* Editable code text area */}
            <textarea
              value={activeFile.content}
              onChange={(e) => updateFileContent(activeFile.path, e.target.value)}
              spellCheck={false}
              className="flex-1 p-4 bg-transparent text-slate-200 font-mono text-xs leading-6 resize-none focus:outline-none overflow-auto selection:bg-sky-500/30 whitespace-pre"
            />
          </div>

        </div>

      </div>

      {/* Modal: Create Branch */}
      {createBranchModalOpen && (
        <Modal
          isOpen={createBranchModalOpen}
          onClose={() => setCreateBranchModalOpen(false)}
          title="Create New Feature Branch"
          subtitle="Isolate your mobile showcase modifications in a separate pipeline."
          maxWidth="max-w-md"
        >
          <form onSubmit={handleCreateBranchSubmit} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Branch Identifier
              </label>
              <input
                type="text"
                required
                value={newBranchInput}
                onChange={(e) => setNewBranchInput(e.target.value)}
                placeholder="e.g. feature/homepage-update"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              New branches will be created from <strong>{currentBranch}</strong> and switched to immediately.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setCreateBranchModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs"
              >
                Create Branch
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal: Fake Preview Panel */}
      {previewModalOpen && (
        <Modal
          isOpen={previewModalOpen}
          onClose={() => setPreviewModalOpen(false)}
          title="Component Preview Sandbox"
          subtitle={`Simulated render preview for ${activeFile.name} on branch ${currentBranch}`}
          maxWidth="max-w-3xl"
        >
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-semibold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Component Preview
              </span>
              <span className="text-[10px] text-slate-400 font-mono">120 FPS Sandbox</span>
            </div>

            {/* Simulated component output */}
            <div className="p-6 rounded-xl bg-slate-900 border border-slate-800/80 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center mx-auto">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Rendering: {activeFile.name}</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                  Component compiled successfully with zero syntax errors. Simulated preview matches standard viewport specifications.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 font-mono text-[11px] text-sky-300 max-w-sm mx-auto border border-slate-800">
                Status: HMR Ready • Bundle Size: 14.2 KB
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setPreviewModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-sky-500 text-slate-950 font-bold text-xs"
              >
                Close Preview
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal: Simulated Deploy Confirmation */}
      {deployModalOpen && (
        <Modal
          isOpen={deployModalOpen}
          onClose={() => {
            if (!isDeploying) setDeployModalOpen(false);
          }}
          title="Production Deployment Release"
          subtitle={`Deploying branch: ${currentBranch} to App Store & Google Play channels`}
          maxWidth="max-w-lg"
        >
          <div className="space-y-4 pt-2">
            
            {deployStep === 0 && (
              <>
                <p className="text-xs text-slate-300 leading-relaxed">
                  You are about to simulate a release to production channels. This pipeline will trigger:
                </p>
                <ul className="space-y-2 text-xs text-slate-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-400" />
                    <span>Linter & Oxlint code verification</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-400" />
                    <span>Ahead-of-Time (AOT) bytecode compilation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-400" />
                    <span>Apple App Store TestFlight & Google Play Internal track upload</span>
                  </li>
                </ul>

                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300">
                  Notice: This is a frontend mock deployment demonstration. No real API calls will be dispatched.
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    onClick={() => setDeployModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleStartDeploy}
                    className="px-6 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-lg shadow-sky-500/25"
                  >
                    Confirm & Start Simulated Deploy
                  </button>
                </div>
              </>
            )}

            {deployStep > 0 && deployStep < 5 && (
              <div className="py-6 space-y-4 text-center">
                <div className="w-12 h-12 rounded-full border-2 border-sky-400 border-t-transparent animate-spin mx-auto" />
                <h4 className="text-sm font-bold text-white">
                  Executing Pipeline Steps...
                </h4>
                <div className="text-xs font-mono text-sky-400">
                  {deployStep === 1 && 'Step 1/4: Running linter & typing audits...'}
                  {deployStep === 2 && 'Step 2/4: Compiling native Android & iOS bundles...'}
                  {deployStep === 3 && 'Step 3/4: Uploading artifacts to TestFlight & Play Console...'}
                  {deployStep === 4 && 'Step 4/4: Finalizing release manifest...'}
                </div>
              </div>
            )}

            {deployStep === 5 && (
              <div className="py-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-white">Release Deployed Successfully!</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Artifacts signed and staged for release across all production distribution nodes.
                </p>
                <button
                  onClick={() => {
                    setDeployModalOpen(false);
                    setDeployStep(0);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-sky-500 text-slate-950 font-bold text-xs hover:bg-sky-400 transition-colors"
                >
                  Done
                </button>
              </div>
            )}

          </div>
        </Modal>
      )}

    </div>
  );
};
