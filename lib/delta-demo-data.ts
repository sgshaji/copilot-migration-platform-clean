export const classicBots = [
  {
    id: 'classic-1',
    name: 'HR FAQ Bot',
    intents: ['leave_balance', 'policy_info'],
    integrations: ['Teams'],
    limitations: ['No proactive reminders', 'No email integration']
  },
  {
    id: 'classic-2',
    name: 'IT Helpdesk Bot',
    intents: ['password_reset', 'software_request'],
    integrations: ['Teams'],
    limitations: ['No predictive analytics', 'No workflow automation']
  }
]

export const migratedAgents = [
  {
    id: 'agent-1',
    name: 'HR Copilot Agent',
    skills: ['leave_balance', 'policy_info', 'proactive_reminders', 'email_summary'],
    integrations: ['Teams', 'Outlook'],
    newCapabilities: ['Proactive reminders', 'Email summarization']
  },
  {
    id: 'agent-2',
    name: 'IT Copilot Agent',
    skills: ['password_reset', 'software_request', 'predictive_analytics', 'workflow_automation'],
    integrations: ['Teams', 'Power Automate'],
    newCapabilities: ['Predictive analytics', 'Workflow automation']
  }
] 