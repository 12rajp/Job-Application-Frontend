'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import {Dialog,DialogContent,DialogHeader,DialogTitle,} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
      <DialogContent className="bg-slate-800 text-white border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-2xl">Login</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="identifier">Email or Username</Label>
            <Input
              id="identifier"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              className="bg-slate-700 border-slate-600"
            />
          </div>
          
          <div>
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
            <p className={`text-sm ${message.includes('success') ? 'text-green-400' : 'text-red-400'}`}>
              {message}
            </p>
          )}

          <div className="flex gap-3">
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'Loading...' : 'Login'}
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="border-slate-600 hover:bg-slate-700"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
