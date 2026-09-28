import type { InputHTMLAttributes } from "react";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
}

export default function FormField({ id, label, ...inputProps }: FormFieldProps) {
  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-slate-600 mb-1.5"
      >
        {label}
      </label>
      <input
        id={id}
        {...inputProps}
        className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
      />
    </div>
  );
}
