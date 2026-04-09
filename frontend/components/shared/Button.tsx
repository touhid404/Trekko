"use client"

import Link from "next/link"
import { ReactNode } from "react"

interface ButtonProps {
  label: string | ReactNode
  href?: string
  onClick?: () => void
  loading?: boolean
  disabled?: boolean
  className?: string
  variant?: "primary" | "secondary" | "outline"
  size?: "sm" | "md" | "lg"
}

export default function Button({
  label,
  href,
  onClick,
  loading = false,
  disabled = false,
  className = "",
  variant = "primary",
  size = "md",
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold transition-all duration-300 ease-in-out rounded-full cursor-pointer hover:scale-105 active:scale-95"

  const sizeStyles = {
    sm: "px-4 py-1.5 text-sm",
    md: "px-6 py-2 text-base",
    lg: "px-8 py-3 text-lg",
  }

  const variantStyles = {
    primary:
      "bg-[#1989A3] text-white shadow-md hover:shadow-lg hover:bg-[#4C25D4] active:bg-[#3A1C8C]",

    secondary:
      "bg-[#E6D9FF] text-[#1989A3] shadow-sm hover:shadow-md hover:bg-[#D6C7FF] active:bg-[#C4B2FF]",

    outline:
      "border-2 border-[#1989A3] text-[#1989A3] hover:bg-[#F3EEFF] active:bg-[#E6D9FF]",
  }

  const buttonClass = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className} ${
    (loading || disabled) && "opacity-60 cursor-not-allowed"
  }`

  const buttonContent = (
    <>
      {loading && (
        <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      <span>{label}</span>
    </>
  )

  if (href && !loading && !disabled) {
    return (
      <Link href={href}>
        <button className={buttonClass}>{buttonContent}</button>
      </Link>
    )
  }

  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className={buttonClass}
    >
      {buttonContent}
    </button>
  )
}
