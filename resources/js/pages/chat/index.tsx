import { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Bot,
    MessageSquare,
    Plus,
} from 'lucide-react';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Conversation = {
    id: number;
    title: string;
    created_at: string;
    updated_at: string;
};

export default function Index() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        loadConversations();
    }, []);

    const loadConversations = async () => {
        try {
            const { data } = await axios.get(
                '/api/conversations',
            );

            setConversations(data);
        } catch (error) {
            console.error(
                'Failed to load conversations:',
                error,
            );
        } finally {
            setLoading(false);
        }
    };

    const createConversation = async () => {
        if (!title.trim() || creating) {
            return;
        }

        setCreating(true);

        try {
            const { data } = await axios.post(
                '/api/conversations',
                {
                    title: title.trim(),
                },
            );

            setConversations((previous) => [
                data,
                ...previous,
            ]);

            setTitle('');
            setDialogOpen(false);
        } catch (error) {
            console.error(
                'Failed to create conversation:',
                error,
            );
        } finally {
            setCreating(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}

            <header className="border-b">
                <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                            <Bot className="h-5 w-5" />
                        </div>

                        <div>
                            <h1 className="text-xl font-semibold">
                                GrazingBox AI
                            </h1>

                            <p className="text-sm text-muted-foreground">
                                Your AI business assistant
                            </p>
                        </div>
                    </div>

                    {/* New Conversation */}

                    <Dialog
                        open={dialogOpen}
                        onOpenChange={setDialogOpen}
                    >
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                New Conversation
                            </Button>
                        </DialogTrigger>

                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    New Conversation
                                </DialogTitle>

                                <DialogDescription>
                                    Give your conversation a name so
                                    you can easily find it later.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="py-4">
                                <Input
                                    value={title}
                                    onChange={(event) =>
                                        setTitle(
                                            event.target.value,
                                        )
                                    }
                                    onKeyDown={(event) => {
                                        if (
                                            event.key === 'Enter'
                                        ) {
                                            createConversation();
                                        }
                                    }}
                                    placeholder="e.g. August Sales"
                                    autoFocus
                                />
                            </div>

                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={() =>
                                        setDialogOpen(false)
                                    }
                                >
                                    Cancel
                                </Button>

                                <Button
                                    onClick={
                                        createConversation
                                    }
                                    disabled={
                                        creating ||
                                        !title.trim()
                                    }
                                >
                                    {creating
                                        ? 'Creating...'
                                        : 'Create Conversation'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </header>

            {/* Content */}

            <main className="mx-auto max-w-5xl px-6 py-8">
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold">
                        Conversations
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Continue a previous conversation or start
                        something new.
                    </p>
                </div>

                {/* Loading */}

                {loading && (
                    <div className="py-20 text-center text-sm text-muted-foreground">
                        Loading conversations...
                    </div>
                )}

                {/* Empty */}

                {!loading &&
                    conversations.length === 0 && (
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-20 text-center">
                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                                <MessageSquare className="h-6 w-6 text-muted-foreground" />
                            </div>

                            <h3 className="font-semibold">
                                No conversations yet
                            </h3>

                            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                                Start a conversation with
                                GrazingBox AI to analyze your
                                orders, sales, and customers.
                            </p>

                            <Button
                                className="mt-5"
                                onClick={() =>
                                    setDialogOpen(true)
                                }
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Create your first conversation
                            </Button>
                        </div>
                    )}

                {/* Conversations */}

                {/* {!loading &&
                    conversations.length > 0 && (
                        <div className="grid gap-3">
                            {conversations.map(
                                (conversation) => (
                                    <button
                                        key={conversation.id}
                                        type="button"
                                        onClick={() => {
                                            window.location.href = `/ai/conversations/${conversation.id}`;
                                        }}
                                        className="group flex items-center gap-4 rounded-xl border p-4 text-left transition hover:bg-muted/50"
                                    >
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                                            <MessageSquare className="h-5 w-5 text-muted-foreground" />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <h3 className="truncate font-medium">
                                                {
                                                    conversation.title
                                                }
                                            </h3>

                                            <p className="mt-1 text-xs text-muted-foreground">
                                                Updated{' '}
                                                {new Date(
                                                    conversation.updated_at,
                                                ).toLocaleString()}
                                            </p>
                                        </div>
                                    </button>
                                ),
                            )}
                        </div>
                    )} */}
            </main>
        </div>
    );
}