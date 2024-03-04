import React, { useState } from 'react'
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { Cog8ToothIcon } from '@heroicons/react/24/outline'
import { Networks } from '@/app/interfaces'


function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}

export default function SettingsDropdown() {
    const [active, setActive] = useState<string>(Networks.Testnet)

    return (
        <Menu as="div" className="relative inline-block text-left">
            <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 px-3 py-2 text-sm font-semibold text-gray-900">
                <Cog8ToothIcon className={`hover:test-visible h-6 w-6 transition duration-500 hover:cursor-pointer text-gray-500`} />
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
                <Menu.Items static className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                        {(Object.keys(Networks) as Array<keyof typeof Networks>).map((key) => {
                            return (
                                <Menu.Item key={key} disabled={key == 'Mainnet' ? true : false}>
                                    <a
                                        onClick={(_e) => setActive(key)}
                                        href="#"
                                        className={classNames(
                                            active == key ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                            'block px-4 py-2 text-sm', key == 'Mainnet'? ' text-gray-200 cursor-not-allowed': ''
                                        )}
                                    >
                                        {key}
                                    </a>
                                </Menu.Item>
                            )
                        })}
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    )
}
