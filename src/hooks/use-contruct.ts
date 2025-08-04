
export function useContructUrl(key:string){
    return `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.t3.storage.dev/${key}`
}

