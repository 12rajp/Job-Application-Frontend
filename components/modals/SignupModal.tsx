'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

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
    if (!username || !email || !password) {
      setMessage('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setMessage('Password must be at least 6 characters');
      return;
    }

    const result = await signup({ user_name: username, email, password });
    
    if (!result.success) {
      setMessage(result.message || 'Registration failed');
    } else {
      setMessage('Registration successful! Redirecting...');
      setTimeout(() => {
        onClose();
        setUsername('');
        setEmail('');
        setPassword('');
        setMessage('');
      }, 500);
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
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              disabled={loading}
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              disabled={loading}
            />
          </div>
          
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              disabled={loading}
            />
          </div>
          
          {message && (
            <p className={`text-sm ${
              message.includes('successful') ? 'text-green-400' : 'text-red-400'
            }`}>
              {message}
            </p>
          )}
          
          <div className="flex justify-end">
            <Button 
              onClick={handleSubmit} 
              disabled={loading}
              className="w-28 bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? 'Loading' : 'Sign Up'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
