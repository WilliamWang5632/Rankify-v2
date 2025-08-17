import { Alert, AlertDescription } from "./ui/alert"

export default function AlertMessages({error, success}: {error: string, success: string}) {
    return (
        <>
            {error && (
                <Alert className="mb-6 border-[#d62d2d]">
                <AlertDescription className="text-[#d62d2d]">{error}</AlertDescription>
                </Alert>
            )}
            
            {success && (
                <Alert className="mb-6 border-green-600 bg-green-900/20">
                <AlertDescription className="text-green-400">{success}</AlertDescription>
                </Alert>
            )}
        </>
    )
}