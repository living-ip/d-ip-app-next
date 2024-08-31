import React from 'react';

export const Section = ({title, children}) => (
    <section className="mb-6">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        {children}
    </section>
);
