import { Label } from '@/shared/components/ui/label';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger
} from '@/shared/components/ui/tooltip';

type ParagraphProps = {
	tooltip?: string;
	children: React.ReactNode;
} & React.ComponentProps<typeof Label>;

export const Paragraph = ({ children, tooltip, ...props }: ParagraphProps) => {
	return tooltip ? (
		<Tooltip>
			<TooltipTrigger>{children}</TooltipTrigger>
			<TooltipContent>{tooltip}</TooltipContent>
		</Tooltip>
	) : (
		<Label {...props}>{children}</Label>
	);
};
