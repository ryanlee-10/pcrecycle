-- Create Charities Table
CREATE TABLE public.charities (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    total_funds_raised NUMERIC DEFAULT 0
);

-- Create Inventory Table
CREATE TABLE public.inventory (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('CPU', 'GPU', 'RAM', 'Motherboard', 'Storage', 'PSU', 'Case', 'Other')),
    specs JSONB NOT NULL DEFAULT '{}'::jsonb,
    condition TEXT NOT NULL CHECK (condition IN ('New', 'Like New', 'Good', 'Fair', 'Scrap')),
    price NUMERIC NOT NULL,
    donor_name TEXT NOT NULL,
    charity_id TEXT REFERENCES public.charities(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'sold', 'scrap')),
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Donations Table
CREATE TABLE public.donations (
    id TEXT PRIMARY KEY,
    company_name TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    parts_description TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    condition_estimate TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'listed')),
    submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Orders Table
CREATE TABLE public.orders (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    shipping_address TEXT NOT NULL,
    total_price NUMERIC NOT NULL,
    order_date TIMESTAMPTZ DEFAULT NOW()
);

-- Create Order Items Table (M-to-M link)
CREATE TABLE public.order_items (
    order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
    part_id TEXT REFERENCES public.inventory(id) ON DELETE CASCADE,
    PRIMARY KEY (order_id, part_id)
);

-- Create Messages Table
CREATE TABLE public.messages (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    date TIMESTAMPTZ DEFAULT NOW(),
    read BOOLEAN DEFAULT false
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.charities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create Policies (Allowing trust-based read and write operations for public mock application)
CREATE POLICY "Allow public read access" ON public.charities FOR SELECT USING (true);
CREATE POLICY "Allow public update access" ON public.charities FOR UPDATE USING (true);

CREATE POLICY "Allow public read access" ON public.inventory FOR SELECT USING (true);
CREATE POLICY "Allow public write access" ON public.inventory FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON public.inventory FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON public.inventory FOR DELETE USING (true);

CREATE POLICY "Allow public read access" ON public.donations FOR SELECT USING (true);
CREATE POLICY "Allow public write access" ON public.donations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON public.donations FOR UPDATE USING (true);

CREATE POLICY "Allow public read access" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Allow public write access" ON public.orders FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access" ON public.order_items FOR SELECT USING (true);
CREATE POLICY "Allow public write access" ON public.order_items FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access" ON public.messages FOR SELECT USING (true);
CREATE POLICY "Allow public write access" ON public.messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON public.messages FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON public.messages FOR DELETE USING (true);

-- Seed Charities
INSERT INTO public.charities (id, name, description, total_funds_raised) VALUES
('world-computer-exchange', 'World Computer Exchange', 'Provides computers and digital literacy training to youth in developing countries.', 1250),
('eff', 'Electronic Frontier Foundation', 'Defends digital privacy, free speech, and innovation in the digital age.', 890),
('direct-relief', 'Direct Relief', 'Provides humanitarian medical aid to people affected by poverty or emergencies.', 1420)
ON CONFLICT (id) DO NOTHING;

-- Seed Default Inventory Items
INSERT INTO public.inventory (id, name, category, specs, condition, price, donor_name, charity_id, status, image_url) VALUES
('part-1', 'Intel Core i7-10700K CPU', 'CPU', '{"Socket": "LGA1200", "Cores": "8", "Threads": "16", "Base Clock": "3.8 GHz", "Boost": "5.1 GHz"}', 'Good', 120, 'TechCorp LLC', 'world-computer-exchange', 'available', 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&q=80'),
('part-2', 'NVIDIA GeForce RTX 3070 GPU', 'GPU', '{"VRAM": "8GB GDDR6", "Interface": "PCIe 4.0 x16", "Output": "3x DP, 1x HDMI"}', 'Like New', 310, 'Cyberdyne Systems', 'eff', 'available', 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&q=80'),
('part-3', 'Corsair Vengeance LPX 16GB DDR4 RAM', 'RAM', '{"Capacity": "16GB (2x8GB)", "Speed": "3200 MHz", "Type": "DDR4", "CAS": "16"}', 'New', 45, 'Initech', 'direct-relief', 'available', 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=400&q=80'),
('part-4', 'ASUS ROG Strix B550-F Gaming Motherboard', 'Motherboard', '{"Socket": "AM4", "Chipset": "B550", "Form": "ATX", "Memory": "4x DDR4"}', 'Good', 95, 'Initech', 'direct-relief', 'available', 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80'),
('part-5', 'EVGA SuperNOVA 750W G3 Power Supply', 'PSU', '{"Power": "750W", "Rating": "80+ Gold", "Modular": "Fully", "Fan": "130mm HDB"}', 'Like New', 65, 'Hooli', 'world-computer-exchange', 'available', 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&q=80'),
('part-6', 'NZXT H510 Flow Mid-Tower Case', 'Case', '{"Form": "ATX Mid-Tower", "Weight": "6.6 kg", "Radiator": "Up to 280mm"}', 'Fair', 40, 'TechCorp LLC', 'eff', 'available', 'https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?w=400&q=80'),
('part-7', 'Samsung 970 EVO Plus 1TB NVMe SSD', 'Storage', '{"Capacity": "1TB", "Form": "M.2 (2280)", "Interface": "PCIe Gen 3x4", "Read": "3500 MB/s", "Write": "3300 MB/s"}', 'Like New', 55, 'Cyberdyne Systems', 'direct-relief', 'available', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80')
ON CONFLICT (id) DO NOTHING;

-- Seed Default Donations
INSERT INTO public.donations (id, company_name, contact_email, parts_description, quantity, condition_estimate, status, submitted_at) VALUES
('don-1', 'Acme Corp', 'it@acme.com', '15x Intel Core i5 CPUs (8th Gen), 10x 8GB DDR4 RAM sticks, 5x 500W Power Supplies', 30, 'Good - Removed from working office PCs during an upgrade.', 'approved', '2026-07-10T14:32:00Z'),
('don-2', 'Globex Industries', 'hardware@globex.org', '4x NVIDIA GTX 1060 GPUs, 2x ATX Cases, 3x Intel Motherboards', 9, 'Fair - Some dust, fans spinning fine, fully tested.', 'pending', '2026-07-12T09:15:00Z')
ON CONFLICT (id) DO NOTHING;

-- Seed Default Messages
INSERT INTO public.messages (id, name, email, subject, message, date, read) VALUES
('msg-seed-1', 'John Doe', 'john@techsolutions.com', 'Bulk Motherboards Donation Logistics', 'Hello! We have about 40 working server-grade motherboard components. Can we arrange a drop-off or pickup next week?', '2026-07-11T15:38:09Z', false)
ON CONFLICT (id) DO NOTHING;
