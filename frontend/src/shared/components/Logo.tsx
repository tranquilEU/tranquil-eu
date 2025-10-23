import { useNavigate } from 'react-router-dom';

import { ROUTES } from '@/shared/constants';

export default function Logo() {
	const navigate = useNavigate();
	return (
		<div
			className="relative flex h-24 w-24 items-center justify-center rounded-full bg-blue-900 hover:cursor-pointer"
			onClick={() => navigate(ROUTES.Home)}
		>
			{/* Stars */}
			{Array.from({ length: 12 }).map((_, i) => {
				const angle = (i * 360) / 12; // 12 stars evenly spaced
				const containerSize = 96; // h-24 = 6rem = 96px
				const padding = 10; // keeps stars away from edge
				const radius = containerSize / 2 - padding; // dynamic radius
				const x = Math.cos((angle * Math.PI) / 180) * radius;
				const y = Math.sin((angle * Math.PI) / 180) * radius;

				return (
					<span
						key={i}
						className="absolute text-[0.7rem] text-yellow-400"
						style={{
							transform: `translate(${x}px, ${y}px)`
						}}
					>
						★
					</span>
				);
			})}

			{/* Center Text */}
			<div className="flex-shrink-0 text-xs font-bold text-white">
				Tranquil<span className="text-blue-400">EU</span>
			</div>
		</div>
	);
}
