import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import { Link } from '@inertiajs/react';
import { ArrowLeft, Send } from 'lucide-react';

type Message = {
    id: number;
    role: 'user' | 'assistant';
    message: string;
};

type Conversation = {
    id: number;
    title: string;
    messages: Message[];
};

type Props = {
    conversation: Conversation;
};

export default function Show({ conversation }: Props) {
    const [messages, setMessages] = useState<Message[]>(
        conversation.messages,
    );

    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: 'smooth',
        });
    }, [messages]);

    const send = async () => {
        if (!message.trim() || loading) {
            return;
        }

        const text = message.trim();

        // Immediately display user's message
        setMessages((previous) => [
            ...previous,
            {
                id: Date.now(),
                role: 'user',
                message: text,
            },
        ]);

        setMessage('');
        setLoading(true);

        try {
            const { data } = await axios.post(
                `/api/conversations/${conversation.id}/messages`,
                {
                    message: text,
                },
            );

            // Display Gemini response
            setMessages((previous) => [
                ...previous,
                {
                    id: data.message.id,
                    role: 'assistant',
                    message: data.message.message,
                },
            ]);
        } catch (error) {
            console.error(
                'Failed to send message:',
                error,
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen flex-col bg-zinc-950">
            {/* Header */}

            <header className="flex items-center gap-4 border-b border-zinc-800 px-6 py-4">
                <Link
                    href="/chat"
                    className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Link>

                <div>
                    <h1 className="text-xl font-semibold text-white">
                        {conversation.title}
                    </h1>

                    <p className="text-sm text-zinc-400">
                        GrazingBox AI
                    </p>
                </div>
            </header>

            {/* Messages */}

            <main className="flex-1 overflow-y-auto p-6">
                <div className="mx-auto max-w-4xl space-y-6">
                    {messages.length === 0 && (
                        <div className="mt-20 text-center">
                            <h2 className="text-3xl font-bold text-white">
                                Welcome 👋
                            </h2>

                            <p className="mt-2 text-zinc-400">
                                How can I help with
                                GrazingBoxPH?
                            </p>

                            <div className="mt-6 flex flex-wrap justify-center gap-3">
                                <button
                                    onClick={() =>
                                        setMessage(
                                            'How much were our sales today?',
                                        )
                                    }
                                    className="rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
                                >
                                    Today's sales
                                </button>

                                <button
                                    onClick={() =>
                                        setMessage(
                                            "Show me today's orders",
                                        )
                                    }
                                    className="rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
                                >
                                    Today's orders
                                </button>

                                <button
                                    onClick={() =>
                                        setMessage(
                                            "Show me tomorrow's deliveries",
                                        )
                                    }
                                    className="rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
                                >
                                    Tomorrow's deliveries
                                </button>
                            </div>
                        </div>
                    )}

                    {messages.map((item) => (
                        <div
                            key={item.id}
                            className={`flex ${
                                item.role === 'user'
                                    ? 'justify-end'
                                    : 'justify-start'
                            }`}
                        >
                            <div
                                className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm shadow ${
                                    item.role === 'user'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-zinc-800 text-zinc-100'
                                }`}
                            >
                                {item.role === 'assistant' ? (
                                    <div className="prose prose-invert max-w-none">
                                        <ReactMarkdown>
                                            {item.message}
                                        </ReactMarkdown>
                                    </div>
                                ) : (
                                    item.message
                                )}
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="flex justify-start">
                            <div className="rounded-2xl bg-zinc-800 px-4 py-3 text-sm text-zinc-300">
                                GrazingBox AI is thinking...
                            </div>
                        </div>
                    )}

                    <div ref={bottomRef} />
                </div>
            </main>

            {/* Input */}

            <footer className="border-t border-zinc-800 p-4">
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        send();
                    }}
                    className="mx-auto flex max-w-4xl gap-3"
                >
                    <input
                        value={message}
                        onChange={(event) =>
                            setMessage(event.target.value)
                        }
                        placeholder="Ask GrazingBox AI..."
                        disabled={loading}
                        className="flex-1 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-blue-500"
                    />

                    <button
                        type="submit"
                        disabled={
                            loading || !message.trim()
                        }
                        className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Send className="h-4 w-4" />

                        {loading
                            ? 'Thinking...'
                            : 'Send'}
                    </button>
                </form>
            </footer>
        </div>
    );
}