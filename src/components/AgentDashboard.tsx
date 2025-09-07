import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, GitPullRequest, AlertCircle, CheckCircle, Clock, Users, FileText, Shield, Activity, AlertTriangle } from 'lucide-react';

// Enhanced TypeScript interfaces with better type safety
interface Agent {
  id: string;
  name: string;
  status: 'idle' | 'working' | 'active';
  currentTask: string | null;
  heartbeat: number;
  action?: string;
}

interface TaskMetrics {
  latency_ms_p50_max: number;
  coverage_min_percent: number;
}

interface Task {
  id: string;
  title: string;
  goal: string;
  acceptance_criteria: string[];
  status: 'ready_for_assignment' | 'in_progress' | 'done' | 'blocked';
  metrics?: TaskMetrics;
  allowed_paths?: string[];
  assigned_to: string | null;
  progress?: number;
  created_at: number;
}

interface Metrics {
  wipLimit: number;
  currentWIP: number;
  avgCycleTime: string;
  throughput: string;
  healthyAgents: number;
  totalAgents: number;
}

// Consolidated initial agents with proper typing
const INITIAL_AGENTS: Record<string, Agent> = {
  planner: { id: 'planner', name: 'Planner', status: 'idle' as const, currentTask: null, heartbeat: Date.now() },
  implementer: { id: 'implementer', name: 'Implementer', status: 'idle' as const, currentTask: null, heartbeat: Date.now() },
  critic: { id: 'critic', name: 'Critic', status: 'idle' as const, currentTask: null, heartbeat: Date.now() },
  verifier: { id: 'verifier', name: 'Verifier', status: 'idle' as const, currentTask: null, heartbeat: Date.now() },
  librarian: { id: 'librarian', name: 'Librarian', status: 'idle' as const, currentTask: null, heartbeat: Date.now() },
  governor: { id: 'governor', name: 'Governor', status: 'idle' as const, currentTask: null, heartbeat: Date.now() },
  conductor: { id: 'conductor', name: 'Conductor', status: 'active' as const, currentTask: 'monitoring', heartbeat: Date.now() }
};

// Enhanced sample tasks with comprehensive test cases
const SAMPLE_TASKS: Task[] = [
  {
    id: 'TASK-001',
    title: 'Implement workflow pause/resume',
    goal: 'Add PATCH /orchestrate/{id}/resume endpoint with proper guards',
    acceptance_criteria: [
      '404 when workflow not found',
      '409 when state != paused', 
      'Emits workflow.resumed event',
      'Unit tests passing'
    ],
    status: 'ready_for_assignment' as const,
    metrics: { latency_ms_p50_max: 50, coverage_min_percent: 80 },
    allowed_paths: ['app/routes', 'tests/'],
    assigned_to: null,
    created_at: Date.now() - 300000
  },
  {
    id: 'TASK-002',
    title: 'Add fitness dashboard UI',
    goal: 'React component showing v1/v2 velocity deltas with SSE reconnect',
    acceptance_criteria: [
      'SSE backoff on disconnect',
      'Resume button only when paused',
      'Velocity improvement ≥30%',
      'Component tests passing'
    ],
    status: 'in_progress' as const,
    assigned_to: 'implementer',
    progress: 65,
    created_at: Date.now() - 600000
  },
  {
    id: 'TASK-003',
    title: 'Optimize database queries',
    goal: 'Reduce query response time by implementing proper indexing',
    acceptance_criteria: [
      'Query time reduced by 50%',
      'No breaking changes to API',
      'Migration scripts included',
      'Performance tests passing'
    ],
    status: 'ready_for_assignment' as const,
    metrics: { latency_ms_p50_max: 100, coverage_min_percent: 85 },
    allowed_paths: ['database/', 'migrations/'],
    assigned_to: null,
    created_at: Date.now() - 150000
  }
];

export default function AgentDashboard() {
  const [agents, setAgents] = useState<Record<string, Agent>>(INITIAL_AGENTS);
  const [tasks, setTasks] = useState<Task[]>(SAMPLE_TASKS);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [metrics, setMetrics] = useState<Metrics>({
    wipLimit: 3,
    currentWIP: 1,
    avgCycleTime: '2.3 days',
    throughput: '4.2 tasks/week',
    healthyAgents: 7,
    totalAgents: 7
  });

  // Enhanced heartbeat simulation with better performance
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(agentId => {
          // Simulate realistic heartbeat patterns
          if (Math.random() > 0.1) { // 90% chance of normal heartbeat
            updated[agentId] = {
              ...updated[agentId],
              heartbeat: Date.now()
            };
          }
        });
        return updated;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Optimized workflow simulation with proper error handling
  const simulateWorkflow = useCallback(async () => {
    if (isSimulating) return;
    
    setIsSimulating(true);

    try {
      // Step 1: Assign task to planner
      setAgents(prev => ({
        ...prev,
        planner: { ...prev.planner, status: 'working', currentTask: 'TASK-003', action: 'Planning task breakdown' }
      }));
      
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Step 2: Move to implementer
      setAgents(prev => ({
        ...prev,
        planner: { ...prev.planner, status: 'idle', currentTask: null, action: undefined },
        implementer: { ...prev.implementer, status: 'working', currentTask: 'TASK-003', action: 'Implementing solution' }
      }));
      
      setTasks(prev => prev.map(task => 
        task.id === 'TASK-003' 
          ? { ...task, status: 'in_progress', assigned_to: 'implementer', progress: 30 }
          : task
      ));
      
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Step 3: Progress update
      setTasks(prev => prev.map(task => 
        task.id === 'TASK-003' 
          ? { ...task, progress: 70 }
          : task
      ));
      
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Step 4: Move to verifier
      setAgents(prev => ({
        ...prev,
        implementer: { ...prev.implementer, status: 'idle', currentTask: null, action: undefined },
        verifier: { ...prev.verifier, status: 'working', currentTask: 'TASK-003', action: 'Verifying implementation' }
      }));
      
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Step 5: Complete task
      setAgents(prev => ({
        ...prev,
        verifier: { ...prev.verifier, status: 'idle', currentTask: null, action: undefined }
      }));
      
      setTasks(prev => prev.map(task => 
        task.id === 'TASK-003' 
          ? { ...task, status: 'done', progress: 100, assigned_to: null }
          : task
      ));

      // Update metrics
      setMetrics(prev => ({
        ...prev,
        currentWIP: prev.currentWIP > 0 ? prev.currentWIP - 1 : 0,
        throughput: '4.5 tasks/week'
      }));

    } catch (error) {
      console.error('Simulation error:', error);
    } finally {
      setIsSimulating(false);
    }
  }, [isSimulating]);

  // Enhanced helper functions with proper TypeScript typing
  const getAgentStatusColor = (agent: Agent): string => {
    const timeSinceHeartbeat = Date.now() - agent.heartbeat;
    if (timeSinceHeartbeat > 10000) return 'bg-red-500'; // No heartbeat > 10s
    if (agent.status === 'working') return 'bg-blue-500';
    if (agent.status === 'active') return 'bg-green-500';
    return 'bg-gray-400';
  };

  const getTaskStatusIcon = (status: Task['status']): JSX.Element => {
    switch (status) {
      case 'done': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in_progress': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'blocked': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTaskPriorityColor = (task: Task): string => {
    const age = Date.now() - task.created_at;
    const hoursOld = age / (1000 * 60 * 60);
    
    if (hoursOld > 24) return 'border-l-red-500'; // High priority for old tasks
    if (hoursOld > 12) return 'border-l-yellow-500'; // Medium priority
    return 'border-l-green-500'; // Normal priority
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Universal Playbook: Agent Coordination
          </h1>
          <p className="text-gray-600">
            Live dashboard showing humans + AI agents following the same development ritual
          </p>
          <div className="mt-4 flex items-center gap-4">
            <button
              onClick={simulateWorkflow}
              disabled={isSimulating}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSimulating ? (
                <>
                  <Pause className="w-4 h-4" />
                  Simulating...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Simulate Workflow
                </>
              )}
            </button>
            <div className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* Enhanced Metrics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">WIP Limit</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.currentWIP}/{metrics.wipLimit}</p>
              </div>
              <div className={`p-3 rounded-full ${
                metrics.currentWIP <= metrics.wipLimit ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <Activity className={`w-6 h-6 ${
                  metrics.currentWIP <= metrics.wipLimit ? 'text-green-600' : 'text-red-600'
                }`} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cycle Time</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.avgCycleTime}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Throughput</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.throughput}</p>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <GitPullRequest className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Healthy Agents</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.healthyAgents}/{metrics.totalAgents}</p>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Enhanced Agents Panel */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Active Agents
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {Object.values(agents).map((agent) => {
                  const timeSinceHeartbeat = Date.now() - agent.heartbeat;
                  const isHealthy = timeSinceHeartbeat <= 10000;
                  
                  return (
                    <div key={agent.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${getAgentStatusColor(agent)}`} />
                        <div>
                          <p className="font-medium text-gray-900">{agent.name}</p>
                          <p className="text-sm text-gray-600">
                            {agent.currentTask ? `Working on ${agent.currentTask}` : 'Idle'}
                          </p>
                          {agent.action && (
                            <p className="text-xs text-blue-600 italic">{agent.action}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium capitalize text-gray-900">{agent.status}</p>
                        <p className={`text-xs ${
                          isHealthy ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {isHealthy ? 'Healthy' : 'No heartbeat'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Enhanced Tasks Panel */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Task Queue
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div key={task.id} className={`border-l-4 ${getTaskPriorityColor(task)} bg-gray-50 p-4 rounded-r-lg`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getTaskStatusIcon(task.status)}
                          <h3 className="font-medium text-gray-900">{task.title}</h3>
                          <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                            {task.id}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{task.goal}</p>
                        
                        {task.progress !== undefined && (
                          <div className="mb-2">
                            <div className="flex justify-between text-xs text-gray-600 mb-1">
                              <span>Progress</span>
                              <span>{task.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                                style={{ width: `${task.progress}%` }}
                              />
                            </div>
                          </div>
                        )}
                        
                        <div className="text-xs text-gray-500">
                          {task.assigned_to ? (
                            <span className="text-blue-600">Assigned to {task.assigned_to}</span>
                          ) : (
                            <span>Unassigned</span>
                          )}
                          {task.metrics && (
                            <span className="ml-2">
                              • Max latency: {task.metrics.latency_ms_p50_max}ms
                              • Min coverage: {task.metrics.coverage_min_percent}%
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="ml-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          task.status === 'done' ? 'bg-green-100 text-green-800' :
                          task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          task.status === 'blocked' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {task.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced System Status */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              System Health
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-2">
                  {Math.round((metrics.healthyAgents / metrics.totalAgents) * 100)}%
                </div>
                <p className="text-sm text-gray-600">Agent Uptime</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {tasks.filter(t => t.status === 'done').length}/{tasks.length}
                </div>
                <p className="text-sm text-gray-600">Tasks Completed</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-2">
                  {Math.round(((Date.now() - Math.min(...tasks.map(t => t.created_at))) / (1000 * 60 * 60)) * 10) / 10}h
                </div>
                <p className="text-sm text-gray-600">Session Duration</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}