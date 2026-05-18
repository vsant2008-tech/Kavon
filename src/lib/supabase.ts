import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bpzmcxkajxnjnvoemjlh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwem1jeGthanhuam52b2VtamxoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyMTU2MzAsImV4cCI6MjA4OTc5MTYzMH0.rP9pAnm9GOSE2ZEgYRGF11SwoEgCHw-Y4r9O9ggeChE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
