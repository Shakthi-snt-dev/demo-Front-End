import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { chatService } from '@/Api/services'

interface Message {
  id: string
  conversationId: string
  message: string
  senderId: string
  createdAt?: string
}

interface Conversation {
  id: string
  participants: string[]
  lastMessage?: Message
  createdAt?: string
  updatedAt?: string
}

interface ChatState {
  conversations: Conversation[]
  messages: Record<string, Message[]>
  selectedConversation: Conversation | null
  isLoading: boolean
  error: string | null
  message: string | null
}

const initialState: ChatState = {
  conversations: [],
  messages: {},
  selectedConversation: null,
  isLoading: false,
  error: null,
  message: null,
}

// Fetch conversations
export const fetchConversations = createAsyncThunk(
  'chat/fetchConversations',
  async (_, { rejectWithValue }) => {
    try {
      const response: any = await chatService.getConversations()
      return {
        conversations: response.data || response.items || response,
        message: response.message || response._message || 'Conversations fetched successfully',
      }
    } catch (error: any) {
      const errorMessage = error?.message || error?.data?.detail || error?.data?.title || error?.data?.message || 'Failed to fetch conversations'
      return rejectWithValue(errorMessage)
    }
  }
)

// Fetch messages
export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async (conversationId: string, { rejectWithValue }) => {
    try {
      const response: any = await chatService.getMessages(conversationId)
      return {
        conversationId,
        messages: response.data || response.items || response,
        message: response.message || response._message || 'Messages fetched successfully',
      }
    } catch (error: any) {
      const errorMessage = error?.message || error?.data?.detail || error?.data?.title || error?.data?.message || 'Failed to fetch messages'
      return rejectWithValue(errorMessage)
    }
  }
)

// Send message
export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ conversationId, message }: { conversationId: string; message: string }, { rejectWithValue }) => {
    try {
      const response: any = await chatService.sendMessage(conversationId, message)
      return {
        conversationId,
        message: response.data || response,
        successMessage: response.message || response._message || 'Message sent successfully',
      }
    } catch (error: any) {
      const errorMessage = error?.message || error?.data?.detail || error?.data?.title || error?.data?.message || 'Failed to send message'
      return rejectWithValue(errorMessage)
    }
  }
)

// Create conversation
export const createConversation = createAsyncThunk(
  'chat/createConversation',
  async (data: Partial<Conversation>, { rejectWithValue }) => {
    try {
      const response: any = await chatService.createConversation(data)
      return {
        conversation: response.data || response,
        message: response.message || response._message || 'Conversation created successfully',
      }
    } catch (error: any) {
      const errorMessage = error?.message || error?.data?.detail || error?.data?.title || error?.data?.message || 'Failed to create conversation'
      return rejectWithValue(errorMessage)
    }
  }
)

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearMessage: (state) => {
      state.message = null
    },
    setSelectedConversation: (state, action) => {
      state.selectedConversation = action.payload
    },
    addMessage: (state, action) => {
      const { conversationId, message } = action.payload
      if (!state.messages[conversationId]) {
        state.messages[conversationId] = []
      }
      state.messages[conversationId].push(message)
    },
  },
  extraReducers: (builder) => {
    // Fetch conversations
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.isLoading = false
        state.conversations = action.payload.conversations
        state.message = action.payload.message
        state.error = null
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Fetch messages
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.isLoading = false
        state.messages[action.payload.conversationId] = action.payload.messages
        state.message = action.payload.message
        state.error = null
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Send message
    builder
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false
        if (!state.messages[action.payload.conversationId]) {
          state.messages[action.payload.conversationId] = []
        }
        state.messages[action.payload.conversationId].push(action.payload.message)
        state.message = action.payload.successMessage
        state.error = null
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Create conversation
    builder
      .addCase(createConversation.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createConversation.fulfilled, (state, action) => {
        state.isLoading = false
        state.conversations.push(action.payload.conversation)
        state.message = action.payload.message
        state.error = null
      })
      .addCase(createConversation.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError, clearMessage, setSelectedConversation, addMessage } = chatSlice.actions
export default chatSlice.reducer

