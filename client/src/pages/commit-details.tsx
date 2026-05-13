import Heatmap  from "@/components/Heatmap"
import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query";
import { fetchCommitLogs } from "@/services/api";

export default function CommitDetails() {
    const { id } = useParams();
    const commitId = Number(id);

    const { data: logs, isPending } = useQuery({
        queryKey: ['commitLogs', commitId],
        queryFn: () => fetchCommitLogs(commitId)
    })


    return (
        <div className="p-6">
            <Heatmap
            logs={logs} />
        </div>
    )
}