import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit, Save, Download, Copy, FileText, Clock, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const QuickNotepadTool = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [savedNotes, setSavedNotes] = useState<Array<{id: string, title: string, content: string, createdAt: Date}>>([]);
  const [autoSave, setAutoSave] = useState(true);
  const { toast } = useToast();

  // Auto-save functionality
  useEffect(() => {
    if (autoSave && content.trim() && content.length > 10) {
      const timeoutId = setTimeout(() => {
        saveToLocalStorage();
      }, 2000); // Auto-save after 2 seconds of inactivity

      return () => clearTimeout(timeoutId);
    }
  }, [content, autoSave]);

  // Load saved notes from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('studenthub-quick-notes');
    if (saved) {
      try {
        const notes = JSON.parse(saved).map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt)
        }));
        setSavedNotes(notes);
      } catch (error) {
        console.error('Error loading saved notes:', error);
      }
    }
  }, []);

  const saveToLocalStorage = () => {
    if (!content.trim()) return;

    const noteId = Date.now().toString();
    const newNote = {
      id: noteId,
      title: title || `Note ${new Date().toLocaleDateString()}`,
      content,
      createdAt: new Date()
    };

    const updatedNotes = [newNote, ...savedNotes.slice(0, 9)]; // Keep only 10 most recent
    setSavedNotes(updatedNotes);
    localStorage.setItem('studenthub-quick-notes', JSON.stringify(updatedNotes));
    setLastSaved(new Date());

    toast({
      title: "Note Saved!",
      description: "Your note has been saved locally"
    });
  };

  const saveToServer = async () => {
    if (!content.trim()) {
      toast({
        title: "Content Required",
        description: "Please write something before saving",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch('/api/ai-tools/save-note', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: title || `Note ${new Date().toLocaleDateString()}`,
          content
        })
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Note Saved to Cloud!",
          description: `Your note will be available for 4 hours. ID: ${data.noteId.slice(-8)}`
        });
      } else {
        throw new Error(data.error || 'Failed to save note');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Cloud Save Failed",
        description: "Note was saved locally instead",
        variant: "destructive"
      });
      saveToLocalStorage();
    }
  };

  const loadNote = (note: any) => {
    setTitle(note.title);
    setContent(note.content);
    toast({
      title: "Note Loaded",
      description: `Loaded "${note.title}"`
    });
  };

  const deleteNote = (noteId: string) => {
    const updatedNotes = savedNotes.filter(note => note.id !== noteId);
    setSavedNotes(updatedNotes);
    localStorage.setItem('studenthub-quick-notes', JSON.stringify(updatedNotes));
    toast({
      title: "Note Deleted",
      description: "Note has been removed"
    });
  };

  const copyToClipboard = async () => {
    if (!content.trim()) return;

    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied to Clipboard!",
        description: "Note content has been copied"
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Please copy the text manually",
        variant: "destructive"
      });
    }
  };

  const downloadNote = () => {
    if (!content.trim()) return;

    const noteTitle = title || `Note_${new Date().toISOString().split('T')[0]}`;
    const fileContent = `${title ? `${title}\n${'='.repeat(title.length)}\n\n` : ''}${content}\n\n---\nCreated with StudentHub Quick Notepad\n${new Date().toLocaleString()}`;
    
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${noteTitle.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setTitle('');
    setContent('');
    setLastSaved(null);
  };

  const getWordCount = () => {
    return content.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const getCharCount = () => {
    return content.length;
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <Edit className="w-12 h-12 mx-auto text-primary" />
        <h2 className="text-2xl font-bold gradient-text">Quick Notepad</h2>
        <p className="text-muted-foreground">Write, save, and organize your notes instantly</p>
      </div>

      <Card className="glass">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Write Your Note
            </CardTitle>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="auto-save"
                checked={autoSave}
                onChange={(e) => setAutoSave(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="auto-save" className="text-sm">Auto-save</label>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Title (Optional)</label>
            <Input
              placeholder="Give your note a title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Content</label>
            <Textarea
              placeholder="Start writing your note here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[300px] resize-y"
            />
          </div>

          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <div className="flex gap-4">
              <span>{getWordCount()} words</span>
              <span>{getCharCount()} characters</span>
            </div>
            {lastSaved && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>Saved {lastSaved.toLocaleTimeString()}</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button onClick={saveToLocalStorage} className="btn-primary">
              <Save className="w-4 h-4 mr-2" />
              Save Locally
            </Button>
            
            <Button onClick={saveToServer} variant="outline">
              <Save className="w-4 h-4 mr-2" />
              Save to Cloud
            </Button>
            
            <Button onClick={copyToClipboard} variant="outline">
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
            
            <Button onClick={downloadNote} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            
            <Button onClick={clearAll} variant="outline">
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>

      {savedNotes.length > 0 && (
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {savedNotes.map((note) => (
                <div key={note.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{note.title}</h4>
                    <p className="text-sm text-muted-foreground truncate">
                      {note.content.substring(0, 100)}...
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {note.createdAt.toLocaleDateString()}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {note.content.split(' ').length} words
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => loadNote(note)}
                    >
                      Load
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteNote(note.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};