import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

interface KernelResultsProps {
    headers: string[];
    data: { [key: string]: any }[];
    tableName: string;
}

const KernelResults: React.FC<KernelResultsProps> = ({ tableName, headers, data }) => {
    return (
        <Table>
            <TableCaption>{tableName}</TableCaption>
            <TableHeader>
                <TableRow>
                    {headers.map((header, index) => (
                        <TableHead key={index}>{header}</TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                        {headers.map((header, colIndex) => (
                            <TableCell key={colIndex}>{row[header]}</TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default KernelResults;