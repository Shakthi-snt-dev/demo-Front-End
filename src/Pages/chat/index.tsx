import { useState } from 'react'
import { Search, Edit, MoreVertical, Phone, Video, Smile, Paperclip, Send, ChevronLeft } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  sender: string
  senderAvatar?: string
  text: string
  timestamp: string
  isOwn: boolean
  isRead?: boolean
}

interface Chat {
  id: string
  name: string
  avatar?: string
  lastMessage: string
  timestamp: string
  unreadCount?: number
  isPinned?: boolean
  isTyping?: boolean
}

const mockChats: Chat[] = [
  {
    id: '1',
    name: 'Odama Studio',
    avatar: 'O',
    lastMessage: 'Mas Happy Typing.....',
    timestamp: '05:11 PM',
    unreadCount: 2,
    isPinned: true,
    isTyping: true,
  },
  {
    id: '2',
    name: 'Hatypo Studio',
    avatar: 'H',
    lastMessage: 'Momon : Lahh gas!',
    timestamp: '16:01 PM',
    isPinned: true,
    isRead: true,
  },
  {
    id: '3',
    name: 'Nolaaa',
    avatar: 'N',
    lastMessage: 'Keren banget',
    timestamp: '03:29 PM',
    unreadCount: 4,
  },
  {
    id: '4',
    name: 'Mas Happy',
    avatar: 'M',
    lastMessage: 'Typing...',
    timestamp: '02:21 PM',
    isTyping: true,
  },
  {
    id: '5',
    name: 'Mas Rohmad',
    avatar: 'R',
    lastMessage: 'Zaa jo lali ngeshot yaa',
    timestamp: '01:12 PM',
    unreadCount: 2,
  },
]

const mockMessages: Message[] = [
  {
    id: '1',
    sender: 'Mas Happy',
    text: 'Guysss tahun depan liburan ke Jepun! 🇯🇵🇯🇵',
    timestamp: '05:00 PM',
    isOwn: false,
  },
  {
    id: '2',
    sender: 'Mas Happy',
    text: 'Minta tolong nanti dibuat pembagian tugas kaya biasa',
    timestamp: '05:00 PM',
    isOwn: false,
  },
  {
    id: '3',
    sender: 'You',
    text: 'Gokilll!',
    timestamp: '05:02 PM',
    isOwn: true,
    isRead: true,
  },
  {
    id: '4',
    sender: 'Mas Rohmad',
    text: 'Tenan ki???',
    timestamp: '05:01 PM',
    isOwn: false,
  },
  {
    id: '5',
    sender: 'Mas Happy',
    text: '@Mas Listian @Fazaa @Mba Nayu',
    timestamp: '05:11 PM',
    isOwn: false,
  },
  {
    id: '6',
    sender: 'Mas Happy',
    text: 'Mintol Cek Figma ini dong',
    timestamp: '05:11 PM',
    isOwn: false,
  },
  {
    id: '7',
    sender: 'Mas Happy',
    text: 'https://www.figma.com/file/adcopy..',
    timestamp: '05:11 PM',
    isOwn: false,
  },
  {
    id: '8',
    sender: 'You',
    text: 'Wokee siap mas! utiwi cek 🔥🔥🔥',
    timestamp: '05:12 PM',
    isOwn: true,
    isRead: true,
  },
]

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<string>('1')
  const [message, setMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showChatList, setShowChatList] = useState(true)

  const activeChat = mockChats.find((chat) => chat.id === selectedChat)
  const chatMessages = mockMessages

  const pinnedChats = mockChats.filter((chat) => chat.isPinned)
  const allChats = mockChats.filter((chat) => !chat.isPinned)

  const handleSendMessage = () => {
    if (message.trim()) {
      // Handle send message
      setMessage('')
    }
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] border rounded-xl overflow-hidden bg-background relative">
      {/* Left Sidebar - Chat List */}
      <div className={cn(
        "w-full md:w-80 lg:w-96 border-r bg-card flex flex-col transition-transform duration-300 absolute md:relative inset-0 z-10 md:z-auto",
        showChatList ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">Messages</h2>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {/* Pinned Messages */}
          {pinnedChats.length > 0 && (
            <div className="p-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                Pinned Message
              </h3>
              <div className="space-y-1">
                {pinnedChats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => {
                      setSelectedChat(chat.id)
                      setShowChatList(false)
                    }}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors',
                      selectedChat === chat.id
                        ? 'bg-primary-500 text-white'
                        : 'hover:bg-accent'
                    )}
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary-500 text-white">
                        {chat.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm truncate">{chat.name}</p>
                        <span className="text-xs text-muted-foreground shrink-0 ml-2">
                          {chat.timestamp}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {chat.isTyping ? (
                          <p className="text-xs text-muted-foreground italic">Typing...</p>
                        ) : (
                          <p className="text-xs text-muted-foreground truncate">
                            {chat.lastMessage}
                          </p>
                        )}
                        {chat.unreadCount && selectedChat !== chat.id && (
                          <Badge className="ml-auto bg-primary-500 text-white text-xs h-5 min-w-5 flex items-center justify-center">
                            {chat.unreadCount}
                          </Badge>
                        )}
                        {chat.isRead && selectedChat !== chat.id && (
                          <span className="ml-auto text-primary-500">✓</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Messages */}
          <div className="p-4 pt-0">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
              All Message
            </h3>
            <div className="space-y-1">
              {allChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => {
                    setSelectedChat(chat.id)
                    setShowChatList(false)
                  }}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors',
                    selectedChat === chat.id
                      ? 'bg-primary-500 text-white'
                      : 'hover:bg-accent'
                  )}
                >
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary-500 text-white">
                      {chat.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm truncate">{chat.name}</p>
                      <span className="text-xs text-muted-foreground shrink-0 ml-2">
                        {chat.timestamp}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      {chat.isTyping ? (
                        <p className="text-xs text-muted-foreground italic">Typing...</p>
                      ) : (
                        <p className="text-xs text-muted-foreground truncate">
                          {chat.lastMessage}
                        </p>
                      )}
                      {chat.unreadCount && selectedChat !== chat.id && (
                        <Badge className="ml-auto bg-primary-500 text-white text-xs h-5 min-w-5 flex items-center justify-center">
                          {chat.unreadCount}
                        </Badge>
                      )}
                      {chat.isRead && selectedChat !== chat.id && (
                        <span className="ml-auto text-primary-500">✓</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Pane - Chat Conversation */}
      <div className={cn(
        "flex-1 flex flex-col absolute inset-0 md:relative",
        showChatList ? "hidden md:flex" : "flex"
      )}>
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center justify-between bg-card">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowChatList(true)}
                  className="md:hidden"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary-500 text-white">
                    {activeChat.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{activeChat.name}</p>
                  {activeChat.isTyping ? (
                    <p className="text-xs text-muted-foreground">Typing...</p>
                  ) : (
                    <p className="text-xs text-muted-foreground">Online</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
              <div className="text-center">
                <span className="text-xs text-muted-foreground bg-background px-3 py-1 rounded-full">
                  Today, Jan 30
                </span>
              </div>

              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    'flex gap-3',
                    msg.isOwn ? 'justify-end' : 'justify-start'
                  )}
                >
                  {!msg.isOwn && (
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="bg-primary-500 text-white text-xs">
                        {msg.sender[0]}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      'flex flex-col max-w-[70%]',
                      msg.isOwn ? 'items-end' : 'items-start'
                    )}
                  >
                    {!msg.isOwn && (
                      <p className="text-xs text-muted-foreground mb-1">{msg.sender}</p>
                    )}
                    <div
                      className={cn(
                        'rounded-lg px-4 py-2',
                        msg.isOwn
                          ? 'bg-primary-500 text-white'
                          : 'bg-background border'
                      )}
                    >
                      <p className="text-sm">{msg.text}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                      {msg.isOwn && msg.isRead && (
                        <span className="text-xs text-primary-500">✓✓</span>
                      )}
                    </div>
                  </div>
                  {msg.isOwn && (
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="bg-primary-500 text-white text-xs">
                        Y
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t bg-card">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Smile className="h-5 w-5" />
                </Button>
                <Input
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage()
                    }
                  }}
                  className="flex-1"
                />
                <Button variant="ghost" size="icon">
                  <Paperclip className="h-5 w-5" />
                </Button>
                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  size="icon"
                  className="bg-primary-500 hover:bg-primary-600 text-white"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground">Select a chat to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

