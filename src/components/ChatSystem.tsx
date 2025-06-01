
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, MessageCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  created_at: string;
  sender?: {
    first_name: string;
    last_name: string;
  };
}

interface ChatSystemProps {
  recipientId: string;
  recipientName: string;
  rideId?: string;
}

const ChatSystem: React.FC<ChatSystemProps> = ({ recipientId, recipientName, rideId }) => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!user) return;

    // Créer une table messages si elle n'existe pas déjà
    const createMessagesTable = async () => {
      const { error } = await supabase.rpc('create_messages_table');
      if (error) {
        console.log('Table messages existe déjà ou erreur:', error);
      }
    };

    createMessagesTable();
    fetchMessages();

    // Écouter les nouveaux messages en temps réel
    const subscription = supabase
      .channel('messages')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `or(and(sender_id.eq.${user.id},receiver_id.eq.${recipientId}),and(sender_id.eq.${recipientId},receiver_id.eq.${user.id}))`
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages(prev => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user, recipientId]);

  const fetchMessages = async () => {
    if (!user) return;

    // Pour cette démo, on stocke les messages dans localStorage
    const storageKey = `messages_${[user.id, recipientId].sort().join('_')}`;
    const storedMessages = localStorage.getItem(storageKey);
    
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  };

  const sendMessage = async () => {
    if (!user || !newMessage.trim()) return;

    setLoading(true);
    
    const message: Message = {
      id: Math.random().toString(36).substr(2, 9),
      sender_id: user.id,
      receiver_id: recipientId,
      message: newMessage.trim(),
      created_at: new Date().toISOString(),
      sender: {
        first_name: profile?.first_name || 'Utilisateur',
        last_name: profile?.last_name || ''
      }
    };

    // Pour cette démo, on stocke dans localStorage
    const storageKey = `messages_${[user.id, recipientId].sort().join('_')}`;
    const currentMessages = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const updatedMessages = [...currentMessages, message];
    localStorage.setItem(storageKey, JSON.stringify(updatedMessages));

    setMessages(updatedMessages);
    setNewMessage('');
    setLoading(false);

    // Simuler une réponse automatique du conducteur/passager
    if (recipientId !== user.id) {
      setTimeout(() => {
        const autoReply: Message = {
          id: Math.random().toString(36).substr(2, 9),
          sender_id: recipientId,
          receiver_id: user.id,
          message: "Message reçu ! Je vous recontacte bientôt.",
          created_at: new Date().toISOString(),
          sender: {
            first_name: recipientName.split(' ')[0],
            last_name: recipientName.split(' ')[1] || ''
          }
        };

        const newUpdatedMessages = [...updatedMessages, autoReply];
        localStorage.setItem(storageKey, JSON.stringify(newUpdatedMessages));
        setMessages(newUpdatedMessages);
      }, 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card className="h-96 flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <MessageCircle className="w-4 h-4" />
          Chat avec {recipientName}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-3 pb-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Aucun message pour le moment</p>
                <p className="text-sm">Commencez la conversation !</p>
              </div>
            ) : (
              messages.map((message) => {
                const isFromUser = message.sender_id === user?.id;
                return (
                  <div
                    key={message.id}
                    className={`flex ${isFromUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-3 py-2 rounded-lg ${
                        isFromUser
                          ? 'bg-tropical-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.message}</p>
                      <p className={`text-xs mt-1 opacity-70`}>
                        {new Date(message.created_at).toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Tapez votre message..."
              disabled={loading}
              className="flex-1"
            />
            <Button 
              onClick={sendMessage}
              disabled={loading || !newMessage.trim()}
              size="icon"
              className="bg-tropical-500 hover:bg-tropical-600"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatSystem;
