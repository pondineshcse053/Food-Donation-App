import L from 'leaflet';

export const createCustomPin = (color, text = '') => {
  return L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div style="
        background: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid white;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
      ">
        <span style="
          transform: rotate(45deg);
          color: white;
          font-weight: bold;
          font-size: 11px;
        ">${text}</span>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

export const donorIcon = createCustomPin('#16a34a', 'D');    // Green
export const ngoIcon = createCustomPin('#2563eb', 'N');      // Blue
export const volunteerIcon = createCustomPin('#f59e0b', 'V'); // Orange/Amber
