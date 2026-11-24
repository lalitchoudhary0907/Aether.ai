# Aether — Technical & Design Specification

## 1. Visual Direction (Reference-Driven)
- Theme: Deep obsidian/charcoal dark surfaces with subtle cool cyan/teal and slate ambient gradients.
- Typography: Clean geometric sans-serif with tight display tracking and tabular numbers where applicable.
- Layout: Collapsible/responsive left navigation rail + main workspace canvas with centered hero/composer and quick-action cards.
- Responsiveness: Desktop split layout; tablet/mobile drawer navigation and touch-friendly composer.

## 2. Core MVP Features
- Streaming AI chat responses via Next.js server route + Gemini API.
- User sign-up / sign-in via Supabase Auth.
- Persistent conversations and messages in Supabase PostgreSQL with Row-Level Security.
- Create new chat, switch chats, rename/delete chats, and search chat history.
- Clean Markdown rendering with copyable code blocks, loading/streaming states, and error banners.
