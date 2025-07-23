// app/root/chat/index.tsx
import { ChatScreen } from '@/components/chat/ChatScreen'
import ProtectedLayout from '@/components/layouts/ProtectedLayout'
const ChatMainScreen = () => {
    return (
        <ProtectedLayout>
            <ChatScreen />
        </ProtectedLayout>
    )
}
export default ChatMainScreen
