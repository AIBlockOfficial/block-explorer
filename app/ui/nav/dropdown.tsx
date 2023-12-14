import React from 'react'
import { Fragment } from 'react'
import Link from 'next/link'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'


function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}

export default function Dropdown({ name, items }: { name: string, items: { name: string, href: string }[] }) {
    return (
        <Menu as="div" className="relative ml-3">
            <Menu.Button
                className={classNames(
                    'text-gray-800 hover:bg-gray-300',
                    'rounded-md px-3 py-2 text-sm font-medium', 'flex align-middle justify-center'
                )}>
                <p>{name}</p>
                <ChevronDownIcon className="h-6 w-6 pl-2  text-gray-500" />
            </Menu.Button>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {items.map((item) => (
                        <Menu.Item key={item.name}>
                            <Link href={item.href}
                                className={classNames(true ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')} >
                                {item.name}
                            </Link>
                        </Menu.Item>
                    ))}
                </Menu.Items>
            </Transition>
        </Menu>
    )
}
