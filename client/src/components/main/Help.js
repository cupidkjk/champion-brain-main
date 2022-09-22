import { useState } from "react";
import { AiFillCaretRight } from "react-icons/ai";
import DropDownText from "../utils/DropDownText";
import "../../styles/main/help.scss";
import { help } from "../../utils/data";

const Help = () => {
	const [block, setBlock] = useState(help[0]);

	return (
		<div className="help-container">
			<h1>Help</h1>
			<div className="help">
				<ul className="help-title-list">
					{help.map((helpBlock) => (
						<li
							key={helpBlock.id}
							className={`${
								block.id === helpBlock.id ? "selected-help" : ""
							}`}
							onClick={() => setBlock(help[helpBlock.id])}
						>
							<button
								
							>
								<AiFillCaretRight />
							</button>
							<p>{helpBlock.title}</p>
						</li>
					))}
				</ul>
				<div className='help-content'>
					 {block.nested ? 
					 	<DropDownText items={block.subItems} />
					 	:<pre>{block.text}</pre>}
				</div>
			</div>
		</div>
	);
};

export default Help;
