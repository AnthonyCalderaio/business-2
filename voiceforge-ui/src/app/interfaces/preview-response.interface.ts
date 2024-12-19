export interface PreviewResponse {
    "audioUrl":
    {
        "success": boolean,
        "item": {
            "uuid": string,
            "title": string,
            "body": string,
            "voice_uuid": string,
            "is_archived": boolean,
            "created_at": string,
            "updated_at": string,
            "audio_src": string,
            "last_generated_at": string,
            "timestamps": {
                "phon_chars": [],
                "phon_times": [],
                "graph_chars": [], 
                "graph_times": []
            }
        }
    }
}