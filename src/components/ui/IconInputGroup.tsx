import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

type IconInputGroupProps = {
  label: string;
  icon?: string;
  className?: string;
} & (
  | ({ as?: 'input' } & InputProps)
  | ({ as: 'textarea' } & TextareaProps)
);

export function IconInputGroup({
  label,
  icon,
  as = 'input',
  className = '',
  ...props
}: IconInputGroupProps) {
  return (
    <div className={`form-group-custom ${className}`.trim()}>
      <label className="form-label-custom">{label}</label>
      {as === 'textarea' ? (
        <textarea 
          className="form-input-custom" 
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <div className="input-wrapper">
          {icon && <i className={`${icon} input-icon`}></i>}
          <input 
            className="form-input-custom" 
            {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
          />
        </div>
      )}
    </div>
  );
}
