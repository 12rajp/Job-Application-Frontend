'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Dialog, DialogContent,DialogHeader,DialogTitle,} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignupModal({ isOpen, onClose }: SignupModalProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { signup, loading } = useAuth();

  const handleSubmit = async () => {
    const result = await signup({ 
      user_name: username, 
      email, 
      password 
    });
    setMessage(result.message);
    
    if (result.success) {
      setTimeout(() => {
        onClose();
        setUsername('');
        setEmail('');
        setPassword('');
        setMessage('');
      }, 2000);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 text-white border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-2xl">Sign Up</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-slate-700 border-slate-600"
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              minLength={8}
            />
            <p className="text-xs text-gray-400 mt-1">Minimum 8 characters</p>
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
              {loading ? 'Loading...' : 'Sign Up'}
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
