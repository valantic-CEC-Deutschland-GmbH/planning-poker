import { InputInterface } from "@/interfaces/input";

export default function Input(config: InputInterface) {
    return (
        <label className="input input-bordered flex items-center gap-2">
            { config.icon }
            <input
                type={config.type}
                placeholder={config.placeholder}
                autoComplete={config.autocomplete}
                onChange={e => config.setter(e.target.value)}
                className='grow focus:outline-none focus-visible:ring-0 border-0 text-neutral'
            />
        </label>
    )
}