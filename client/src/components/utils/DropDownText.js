import { useState } from "react";
import { AiFillCaretUp, AiFillCaretDown } from "react-icons/ai";

const DropDownText = ({ items }) => {
	const [showItems, setShowItems] = useState(Array(items.length).fill(false));

	const dropText = (id) => {
		setShowItems((_showItems) => {
			_showItems[id] = true;
			return [..._showItems];
		});
	};

	const pickText = (id) => {
		setShowItems((_showItems) => {
			_showItems[id] = false;
			return [..._showItems];
		});
	}

	return (
		<div className='dropdown-container'>
			{items.map((item) => {
				return (
					<div key={item.id} className='dropdown-content'>
						<div className='heading'>							
							<h3>{item.title}</h3>
							<button onClick={showItems[item.id] ? () => pickText(item.id) : () => dropText(item.id)}>
								{!showItems[item.id] ? <AiFillCaretDown/> : <AiFillCaretUp/>}
							</button>
						</div>
						{showItems[item.id] && <pre>{item.text}</pre>}
					</div>
				);
			})}
		</div>
	);
};

export default DropDownText;