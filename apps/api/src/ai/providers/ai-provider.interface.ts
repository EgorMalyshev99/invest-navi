export interface AiMessage {
  role: 'system' | 'user';
  content: string;
}

export interface AiProvider {
  readonly name: string;
  isConfigured(): boolean;
  complete(messages: AiMessage[]): Promise<string>;
}
