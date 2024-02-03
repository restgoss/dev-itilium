export default function ServiceItem({ selectFunction, item, selectedItem }) {
    return (
        <>
            <div
                className={selectedItem && selectedItem.ServiceUuid === item.ServiceUuid
                    ? `incident-popup__services-item incident-popup__services-item_active`
                    : selectedItem?.ServiceUuid && item.ServiceUuid !== selectedItem.ServiceUuid
                        ? `incident-popup__services-item incident-popup__services-item_inactive`
                        : `incident-popup__services-item`}
                key={item.ServiceUuid}
                id={item.ServiceUuid}
                onClick={() => {
                    if (selectedItem === item) {
                        selectFunction(null);
                    } else {
                        selectFunction(item);
                    }
                }}
            >
                <img src={item.image} alt='' className="incident-popup__services-item__image"></img>
                <p>{item.Service}</p>
            </div>
        </>
    )
}