// components/Chat.js
import {useCallback, useEffect, useRef, useState} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useLocalStorage} from 'usehooks-ts'
import {SendIcon} from "lucide-react";
import Message from "@/components/chat/Message";
import LoadingMessage from "@/components/chat/LoadingMessage";
import {useToast} from "@/components/ui/use-toast";
import {debounce} from "lodash";
import {useRouter} from "next/router";
import {Separator} from "@/components/ui/separator";
import {getAgentChatHistory, sendMessage} from "@/lib/chat";

const CACHE_EXPIRATION_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds

export default function ProjectChat({contextId, initialMessages = [], className = ""}) {
	const router = useRouter()
	const {pid} = router.query

	const [newMessage, setNewMessage] = useLocalStorage(`${pid}-newMessage`, "");
	const [messages, setMessages] = useLocalStorage(`${pid}-messages`, initialMessages);
	const [lastFetchTime, setLastFetchTime] = useLocalStorage(`${pid}-lastFetchTime`, 0);
	const [isLoading, setIsLoading] = useState(false);
	const [isInitialLoading, setIsInitialLoading] = useState(true);
	const [streamedMessage, setStreamedMessage] = useState("");

	const messagesEndRef = useRef(null);
	const {toast} = useToast();

	const scrollToBottom = useCallback(() => {
		messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
	}, []);

	useEffect(() => {
		scrollToBottom();
	}, [messages, scrollToBottom]);

	useEffect(() => {
		const fetchChatHistory = async () => {
			if (pid) {
				try {
					setIsInitialLoading(true);
					const currentTime = Date.now();

					// Check if cache is still valid
					if (currentTime - lastFetchTime < CACHE_EXPIRATION_TIME && messages.length > 0) {
						setIsInitialLoading(false);
						return;
					}

					const history = await getAgentChatHistory(pid);
					if (history && history.chat) {
						setMessages(history.chat);
						setLastFetchTime(currentTime);
					}
				} catch (error) {
					console.error("Error fetching chat history:", error);
					toast({
						title: "Error",
						description: "Failed to load chat history. Please refresh the page.",
						variant: "destructive",
					});
				} finally {
					setIsInitialLoading(false);
				}
			}
		};

		fetchChatHistory();
	}, [setMessages, toast, lastFetchTime, setLastFetchTime, messages.length, pid]);

	const callAgent = useCallback(async (message) => {
		try {
			const reader = await sendMessage(
				pid,
				{
					message
				}
			);

			if (reader) {
				setIsLoading(false);
				const decoder = new TextDecoder();
				let decodedMessage = "";

				while (true) {
					const {done, value} = await reader.read();
					if (done) break;
					const decodedChunk = decoder.decode(value, {stream: true});
					decodedMessage += decodedChunk;
					setStreamedMessage(prevMessage => prevMessage + decodedChunk);
				}

				setMessages(prevMessages => [...prevMessages, {role: 'assistant', content: decodedMessage}]);
				setStreamedMessage("");
			}
		} catch (error) {
			console.error("Error calling agent:", error);
			setIsLoading(false);
			toast({
				title: "Error",
				description: "Failed to get a response from the agent. Please try again.",
				variant: "destructive",
			});
		}
	}, [contextId, pid, setMessages, toast]);

	const handleSend = useCallback(() => {
		if (newMessage.trim() === '') return;

		setIsLoading(true);
		const sentMessage = newMessage.trim();
		setMessages(prevMessages => [...prevMessages, {role: 'user', content: sentMessage}]);
		setNewMessage('');
		callAgent(sentMessage);
	}, [newMessage, setMessages, setNewMessage, callAgent]);

	const debouncedHandleSend = debounce(handleSend, 300);

	const handleKeyPress = useCallback((e) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			debouncedHandleSend();
		}
	}, [debouncedHandleSend]);

	if (isInitialLoading) {
		return (
			<div className="flex items-center justify-center h-full">
				<LoadingMessage/>
			</div>
		);
	}

	return (
		<div className={`flex flex-col h-full text-foreground py-4 ${className}`}>
			<div className="flex-1 overflow-y-auto space-y-2 pb-2 min-h-0">
				{messages.map((message, index) => (
					<Message
						key={index}
						message={message}
						className={message.role === 'user' ? 'justify-end' : ''}
					/>
				))}
				{isLoading && (
					<LoadingMessage/>
				)}
				{streamedMessage && (
					<Message message={{role: 'assistant', content: streamedMessage}}/>
				)}
				<div ref={messagesEndRef}/>
			</div>
			<Separator/>
			<div className="flex items-center gap-2 pt-2 m-2 mb-0">
				<Input
					onChange={(e) => setNewMessage(e.target.value)}
					onKeyPress={handleKeyPress}
					placeholder="Type a message..."
					className="flex-1 bg-transparent pr-2"
					value={newMessage}
					disabled={isLoading}
				/>
				<Button
					size="icon"
					variant="ghost"
					className="rounded-full flex-shrink-0"
					onClick={debouncedHandleSend}
					disabled={isLoading || newMessage.trim() === ''}
				>
					<SendIcon className="w-4 h-4"/>
					<span className="sr-only">Send</span>
				</Button>
			</div>
		</div>
	);
}
