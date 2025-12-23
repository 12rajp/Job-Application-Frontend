'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { login, loading } = useAuth();

  const handleSubmit = async () => {
    const result = await login({ identifier, password });
    setMessage(result.message);

    if (result.success) {
      setTimeout(() => {
        onClose();
        setIdentifier('');
        setPassword('');
        setMessage('');
      }, 1500);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="
          bg-slate-800 text-white border-slate-700
          animate-in fade-in zoom-in-95 duration-300

          [&>button]:cursor-pointer
          [&>button]:transition-transform
          [&>button]:duration-300
          [&>button:hover]:scale-125
        "
      >
        <DialogHeader>
          <DialogTitle className="text-2xl">Login</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="identifier">Email or Username</Label>
            <Input
              id="identifier"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              className="bg-slate-700 border-slate-600"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              className="bg-slate-700 border-slate-600"
            />
          </div>

          {message && (
            <p
              className={`text-sm ${
                message.includes('success')
                  ? 'text-green-400'
                  : 'text-red-400 animate-shake'
              }`}
            >
              {message}
            </p>
          )}

          <div className="flex justify-end pt-2">
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-28 bg-blue-600 hover:bg-blue-700 cursor-pointer flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? 'Loading' : 'Login'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
