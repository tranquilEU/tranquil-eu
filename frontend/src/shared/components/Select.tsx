import {
	Select as SelectComponent,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/shared/components/ui/select';

type Option<T> = {
	label: string;
	value: T;
};

type SelectProps<T> = {
	options: Option<T>[];
	onChange: (value: T) => void;
	className?: string;
	placeholder?: string;
};

export const Select = <T extends string | number>({
	options,
	onChange,
	placeholder,
	className
}: SelectProps<T>) => {
	return (
		<SelectComponent onValueChange={onChange as (value: string) => void}>
			<SelectTrigger className={className}>
				<SelectValue placeholder={placeholder} />
			</SelectTrigger>
			<SelectContent>
				{options.map(option => (
					<SelectItem key={String(option.value)} value={String(option.value)}>
						{option.label}
					</SelectItem>
				))}
			</SelectContent>
		</SelectComponent>
	);
};
