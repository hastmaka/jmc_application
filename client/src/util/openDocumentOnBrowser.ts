export function openDocumentOnBrowser(url: string, name?: string) {
    const fileName = name || url.split('/').pop() || ''
    const ext = fileName.split('.').pop()?.toLowerCase()
    const viewableInBrowser = ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']

    if (ext && viewableInBrowser.includes(ext)) {
        window.open(url, '_blank')
    } else {
        // Use Google Docs Viewer for .doc, .docx, etc.
        window.open(`https://docs.google.com/viewer?url=${encodeURIComponent(url)}`, '_blank')
    }
}