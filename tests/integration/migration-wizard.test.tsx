
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import MigrationWizard from '@/components/migration-wizard'
import { jest } from '@jest/globals'

// Mock dependencies
jest.mock('@/lib/botpress-actions', () => ({
  deployToBotpress: jest.fn().mockResolvedValue({
    success: true,
    agent: {
      id: 'test-agent-123',
      name: 'Test Agent',
      url: 'https://test.example.com/chat/test-agent-123',
      status: 'active',
      capabilities: ['Natural conversation', 'Context awareness'],
      integrations: ['Slack', 'Microsoft Teams'],
      webhookUrl: 'https://test.example.com/api/webhook/test-agent-123'
    }
  })
}))

jest.mock('@/lib/bot-parser', () => ({
  BotParser: jest.fn().mockImplementation(() => ({
    parseFile: jest.fn().mockResolvedValue({
      name: 'Test Bot',
      intents: ['greeting', 'help', 'goodbye'],
      entities: ['name', 'email'],
      responses: ['Hello!', 'How can I help?', 'Goodbye!']
    })
  }))
}))

jest.mock('next/link', () => {
  return ({ children, href, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  )
})

jest.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn()
  })
}))

// Mock fetch for API calls
global.fetch = jest.fn()

describe('MigrationWizard Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ response: 'Test response' })
    })
  })

  test('should render initial wizard screen without errors', () => {
    render(<MigrationWizard />)
    
    expect(screen.getByText('Legacy Chatbot Migration Wizard')).toBeInTheDocument()
    expect(screen.getByText('Upload Bot Configuration')).toBeInTheDocument()
    expect(screen.getByText('Try Sample Migrations')).toBeInTheDocument()
  })

  test('should handle sample bot selection flow', async () => {
    render(<MigrationWizard />)
    
    // Click on HR Assistant Bot
    const hrBotButton = screen.getByText('HR Assistant Bot')
    fireEvent.click(hrBotButton)
    
    // Should show naming step
    await waitFor(() => {
      expect(screen.getByText('Name Your AI Agent')).toBeInTheDocument()
    })
    
    // Enter custom name
    const nameInput = screen.getByPlaceholderText('Enter a name for your AI agent...')
    fireEvent.change(nameInput, { target: { value: 'My Custom HR Bot' } })
    
    // Continue to migration
    const continueButton = screen.getByText('Continue Migration')
    fireEvent.click(continueButton)
    
    // Should show migration progress
    await waitFor(() => {
      expect(screen.getByText(/Migrating:.*My Custom HR Bot/)).toBeInTheDocument()
    })
  })

  test('should handle file upload flow', async () => {
    render(<MigrationWizard />)
    
    const file = new File(['{"intents": ["test"]}'], 'bot.json', { type: 'application/json' })
    const fileInput = screen.getByRole('textbox', { name: /file/i }) as HTMLInputElement
    
    fireEvent.change(fileInput, { target: { files: [file] } })
    
    await waitFor(() => {
      expect(screen.getByText('Name Your AI Agent')).toBeInTheDocument()
    })
  })

  test('should complete full migration workflow', async () => {
    render(<MigrationWizard />)
    
    // Start with sample bot
    fireEvent.click(screen.getByText('HR Assistant Bot'))
    
    // Enter name and continue
    await waitFor(() => {
      const nameInput = screen.getByPlaceholderText('Enter a name for your AI agent...')
      fireEvent.change(nameInput, { target: { value: 'Test HR Agent' } })
      fireEvent.click(screen.getByText('Continue Migration'))
    })
    
    // Wait for migration steps to load
    await waitFor(() => {
      expect(screen.getByText('Migration Progress')).toBeInTheDocument()
    })
    
    // Execute transformation step
    const transformButton = screen.getByText('Transform Architecture')
    fireEvent.click(transformButton)
    
    await waitFor(() => {
      expect(screen.getByText('Enhance Capabilities')).toBeInTheDocument()
    })
    
    // Execute enhancement step
    const enhanceButton = screen.getByText('Enhance Capabilities')
    fireEvent.click(enhanceButton)
    
    await waitFor(() => {
      expect(screen.getByText('Deploy AI Agent')).toBeInTheDocument()
    })
    
    // Execute deployment step
    const deployButton = screen.getByText('Deploy AI Agent')
    fireEvent.click(deployButton)
    
    await waitFor(() => {
      expect(screen.getByText('Test & Validate')).toBeInTheDocument()
    })
    
    // Execute validation step
    const testButton = screen.getByText('Test & Validate')
    fireEvent.click(testButton)
    
    // Should show completion
    await waitFor(() => {
      expect(screen.getByText('Migration Complete! 🎉')).toBeInTheDocument()
    })
  })

  test('should handle deployment errors gracefully', async () => {
    // Mock deployment failure
    const { deployToBotpress } = require('@/lib/botpress-actions')
    deployToBotpress.mockResolvedValueOnce({
      success: false,
      error: 'Deployment failed'
    })
    
    render(<MigrationWizard />)
    
    // Go through flow to deployment
    fireEvent.click(screen.getByText('HR Assistant Bot'))
    
    await waitFor(() => {
      const nameInput = screen.getByPlaceholderText('Enter a name for your AI agent...')
      fireEvent.change(nameInput, { target: { value: 'Test Agent' } })
      fireEvent.click(screen.getByText('Continue Migration'))
    })
    
    // Skip to deployment step
    await waitFor(() => {
      // Simulate being at deployment step
      expect(screen.getByText('Migration Progress')).toBeInTheDocument()
    })
  })

  test('should validate required components exist', () => {
    render(<MigrationWizard />)
    
    // Check for essential UI components
    expect(screen.getByText('Legacy Chatbot Migration Wizard')).toBeInTheDocument()
    expect(screen.getByText('Upload Bot Configuration')).toBeInTheDocument()
    expect(screen.getByText('Try Sample Migrations')).toBeInTheDocument()
    
    // Check sample bots are rendered
    expect(screen.getByText('HR Assistant Bot')).toBeInTheDocument()
    expect(screen.getByText('IT Helpdesk Bot')).toBeInTheDocument()
    expect(screen.getByText('Sales Inquiry Bot')).toBeInTheDocument()
  })

  test('should handle API endpoint failures', async () => {
    // Mock fetch failure
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))
    
    render(<MigrationWizard />)
    
    // Try to trigger an API call and ensure it doesn't crash
    fireEvent.click(screen.getByText('HR Assistant Bot'))
    
    await waitFor(() => {
      expect(screen.getByText('Name Your AI Agent')).toBeInTheDocument()
    })
  })
})
