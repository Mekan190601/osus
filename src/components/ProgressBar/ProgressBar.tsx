type Props = {
    value: number;
    label?: string;
};

export default function ProgressBar({
    value,
    label,
}: Props) {
    return (
        <div className="mt-6">

            <div className="mb-2 flex justify-between text-sm text-slate-300">
                <span>Ösüş</span>
                <span>{label}</span>
            </div>

            <div className="h-4 rounded-full bg-slate-800">

                <div
                    className="h-full rounded-full bg-indigo-500"
                    style={{ width: `${value}%` }}
                />

            </div>

        </div>
    );
}